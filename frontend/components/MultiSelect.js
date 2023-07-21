import * as React from 'react';
import { useState } from 'react';

import Multiselect from 'multiselect-react-dropdown';

export default function MultiSelect({options, placeholder, props, onSelect}) {
    const [selection, setSelection] = useState([options[0]]);
    const [string, setString] = useState("");
    
    function createString(){
        var s = '';
        selection.forEach(element => {
            s+=element.label+"; ";
        });
        setString(s);
    }

    React.useEffect(()=>{
        createString()
    }, [selection])

    function ch(value){
        onSelect(value); 
        setSelection(value); 
        createString();
    }
    
  return (
    <div style={{ width: "20%", height: "100%", marginTop: "1%", marginRight: "2%", ...props}}>
        <Multiselect
            displayValue="label"
            onKeyPressFn={function noRefCheck(){}}
            onRemove={ch}
            onSearch={function noRefCheck(){}}
            onSelect={ch}
            options={options}
            placeholder={selection.length == 0 ? placeholder : string }
            hideSelectedList
            showArrow={true}
            showCheckbox
            selectedValues={[options[0]]}
        />
    </div>
  )
}

