import * as React from 'react';
import { useState } from 'react';

import Multiselect from 'multiselect-react-dropdown';

export default function SingleSelect({options, placeholder, props, onSelect}) {
  const [selection, setSelection] = useState(options[0]);
  const [string, setString] = useState("");
  
  function createString(){
    setString(selection.label);
  }

  React.useEffect(()=>{
      createString()
  }, [])
  return (
    <div style={{ width: "20%", marginTop: "1%", marginRight: "2%", ...props}}>
        <Multiselect
        displayValue="label"
        onKeyPressFn={function noRefCheck(){}}
        onRemove={(value)=>{onSelect(value); setSelection(value); createString();}}
        onSearch={function noRefCheck(){}}
        onSelect={(value)=>{onSelect(value); setSelection(value); createString();}}
        options={options}
        singleSelect
        selectedValues={[options[0]]}
        />
    </div>
  );
}