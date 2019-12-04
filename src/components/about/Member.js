import React from "react";
import styled from "styled-components";

const Member = ({ data }) => (
  <MemberInfo>
    <img src={data.image}></img>
    <h2>{data.name}</h2>
    <Location>
      <i className="fas fa-map-marker-alt"></i>
      {data.location}
    </Location>
  </MemberInfo>
);

export default Member;

const MemberInfo = styled.div`
  display: inline-block;
  margin-left: 75px;
  margin-right: 75px;
  margin-bottom: 60px;
  img {
    width: 250px;
  }
  div {
    font-size: 24px;
    color: #484848;
  }
`;

const Location = styled.div`
  i {
    margin-right: 5px;
  }
`;
