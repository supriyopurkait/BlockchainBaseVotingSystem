import React from "react";

function Detailsdata() {
  return (
    <div className="p-5">
      <ul className="list-unstyled align-center">
        <li>This is a list.</li>
        <li>It appears completely unstyled.</li>
        <li>Structurally, it's still a list.</li>
        <li>However, this style only applies to immediate child elements.</li>
        <li>
          Nested lists:
          <ul>
            <li>are unaffected by this style</li>
            <li>will still show a bullet</li>
            <li>and have appropriate left margin</li>
          </ul>
        </li>
        <li>This may still come in handy in some situations.</li>
      </ul>
    </div>
  );
}

export default Detailsdata;
