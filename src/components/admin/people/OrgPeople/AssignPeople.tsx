import React from "react";

function AssignPeople({ institutionId }: { institutionId: string }) {
  return (
    <div>
      <p>Assign people to organization: {institutionId}</p>
    </div>
  );
}

export default AssignPeople;
