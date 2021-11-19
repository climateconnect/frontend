from typing import List
from django.db import connection
from django.contrib.auth.models import User


def sort_user_resource_preferences(user: User) -> List:
    user_resource_preferences = []
    # TODO: make generic
    hub_location_id = 6
    with connection.cursor() as cursor:
        cursor.execute(f"""
WITH hub_location_ids AS (
    SELECT location_id
    FROM hubs_hub_location
    WHERE hub_id={hub_location_id}
),
projects AS (
    SELECT * FROM organization_project
    JOIN hub_location_ids
    ON organization_project.loc_id=hub_location_ids.location_id
),
orgs AS (
    SELECT *
    FROM organization_organization
    JOIN hub_location_ids
    ON organization_organization.location_id=hub_location_ids.location_id
),
ideas AS (
    SELECT *
    FROM ideas_idea
    JOIN hub_location_ids
    ON ideas_idea.location_id=hub_location_ids.location_id
),
get_user_resource_preference AS (
    select CMUQA.user_id as user_id
        , CMAMD.resource_type_id as resource_type_id
        , DCT.model as resource_model
        , sum(CMAMD.weight) as total_weight
    from climate_match_userquestionanswer CMUQA
    join climate_match_answer CMA on CMA.id = CMUQA.predefined_answer_id
    join climate_match_answer_answer_metadata CMAAMD on CMAAMD.answer_id = CMA.id
    join climate_match_answermetadata CMAMD on CMAMD.id = CMAAMD.answermetadata_id
    join django_content_type DCT on DCT.id = CMAMD.resource_type_id
    where CMUQA.predefined_answer_id is not null and CMUQA.user_id = {user.id}
    group by 1, 2, 3
    order by total_weight desc
), get_user_skill_preference as (
    select cmu.user_id
        , cma.weight
        , cma.reference_id
        , cma.resource_type_id
        , dct.model
    from climate_match_userquestionanswer cmu
    join climate_match_userquestionanswer_answers cmua on cmua.userquestionanswer_id = cmu.id
    join climate_match_answermetadata cma on cma.id = cmua.answermetadata_id
    join django_content_type dct on dct.id = cma.resource_type_id
    where dct.model = 'skill' and cmu.user_id = {user.id}
), get_user_hub_preference as (
    select cmu.user_id
        , cma.weight
        , cma.reference_id
        , cma.resource_type_id
        , dct.model
    from climate_match_userquestionanswer cmu
    join climate_match_userquestionanswer_answers cmua on cmua.userquestionanswer_id = cmu.id
    join climate_match_answermetadata cma on cma.id = cmua.answermetadata_id
    join django_content_type dct on dct.id = cma.resource_type_id
    where dct.model = 'hub' and cmu.user_id = {user.id}
), get_user_reference_table_relevancy_score_by_skills AS (
    SELECT reference_table.table_name, reference_table.id as resource_id, SUM(gusp.weight) as skill_weight
    FROM get_user_skill_preference as gusp
    JOIN (
        (
            SELECT op.id,
            CASE WHEN cs.parent_skill_id IS NULL
            THEN cs.id
            ELSE cs.parent_skill_id END as skill_id,
            'project' as table_name
            FROM projects op
            LEFT JOIN organization_project_skills ops on ops.project_id  = op.id
            LEFT JOIN climateconnect_skill cs on cs.id = ops.skill_id
            WHERE cs.id IS NOT NULL
        )
        union (
            SELECT oo.id,
            CASE WHEN cs.parent_skill_id IS NULL
            THEN cs.id
            ELSE cs.parent_skill_id END as skill_id,
            'organization' as table_name
            FROM orgs oo
            LEFT JOIN organization_projectparents opp on opp.parent_organization_id = oo.id
            LEFT JOIN projects op on op.id = opp.project_id
            LEFT JOIN organization_project_skills ops on ops.project_id = op.id
            LEFT JOIN climateconnect_skill cs on cs.id = ops.skill_id
            WHERE cs.id IS NOT NULL
        )
    ) AS reference_table on reference_table.skill_id = gusp.reference_id
    GROUP BY 1, 2
), get_user_reference_table_relevancy_score_by_hubs as (
    select reference_table.table_name, reference_table.id as resource_id, sum(guhp.weight) as hub_weight
    from get_user_hub_preference as guhp
    join (
        (
            select op.id, hh.id as hub_id, 'project' as table_name
            from hubs_hub hh
            join hubs_hub_filter_parent_tags hhfpt on hhfpt.hub_id = hh.id
            join organization_projecttags optags on optags.id = hhfpt.projecttags_id
                or optags.parent_tag_id = hhfpt.projecttags_id
            join organization_projecttagging opt on opt.project_tag_id = optags.id
                or  opt.project_tag_id  = optags.parent_tag_id
            join projects op on op.id = opt.project_id
        ) union (
            select oo.id, hh.id as hub_id, 'organization' as table_name
            from hubs_hub hh
            join organization_organization_hubs ooh on ooh.hub_id = hh.id
            join orgs oo on oo.id = ooh.organization_id
        ) union (
            select ii.id, hh.id as hub_id, 'idea' as table_name
            from ideas ii
            join hubs_hub hh on hh.id = ii.hub_id
        )
    ) as reference_table on reference_table.hub_id = guhp.reference_id
    group by 1, 2
), get_user_reference_relevancy_score as (
    select (
        case when gurtrs.resource_id is not null then gurtrs.resource_id else gurtrh.resource_id end
        ) as resource_id
        , (
        case when gurtrs.resource_id is not null then gurtrs.table_name else gurtrh.table_name end
        ) as table_name
        , sum(
            (
                case when gurtrs.skill_weight is not null and gurtrh.hub_weight is not null
                    then gurtrs.skill_weight + gurtrh.hub_weight
                when gurtrs.skill_weight is null and gurtrh.hub_weight is not null
                    then gurtrh.hub_weight
                when gurtrs.skill_weight is not null and gurtrh.hub_weight is null
                    then gurtrs.skill_weight
                else 0
                end
            ) +
            coalesce((
                select total_weight from get_user_resource_preference
                where resource_model = gurtrs.table_name
                    or resource_model = gurtrh.table_name
            ), 0)
        ) as total_score
    from get_user_reference_table_relevancy_score_by_skills as gurtrs
    full join get_user_reference_table_relevancy_score_by_hubs as gurtrh
        on gurtrh.resource_id = gurtrs.resource_id
            and gurtrh.table_name = gurtrs.table_name
    group by 1, 2
    order by total_score desc
)

select * from get_user_reference_relevancy_score;
        """)

        columns = [col[0] for col in cursor.description]
        user_resource_preferences = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return user_resource_preferences