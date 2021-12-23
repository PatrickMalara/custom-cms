const state = {
    settings_array: []
};


async function update_setting_record( setting_index ) {

    const setting = state.settings_array[setting_index];

    const setting_text_box_el = document.getElementById(`setting-text-box-${setting.id}`);

    let response = {};

    try {
        
        response = await fetch(`backend/api.php/settings/${setting.id}`, {
            method: "put",
            body: JSON.stringify( {
                value: setting_text_box_el.value.trim()
            } )
        } );
        
        // We are updating our state.settings by reference here... thats why this works
        setting.value = setting_text_box_el.value.trim();

    } catch(error) {
        console.log( "Error", error );
    }
}

(async function main(){

    let response = {};

    try {

        response = await fetch("backend/api.php/settings");
        state.settings_array = await response.json();

        const settings_container_el = document.getElementById("settings-container");

        const setting_component = document.getElementById("settings-component");
    
        const clone = setting_component.content.cloneNode(true);

        for (let i = 0; i < state.settings_array.length; i += 1) {

            const clone = setting_component.content.firstElementChild.cloneNode(true);
            console.log(`Clone${i}`, clone);

            clone.firstElementChild.innerText = state.settings_array[i].name;

            clone.children["1"].value = state.settings_array[i].value;
            clone.children["1"].id       = `setting-text-box-${state.settings_array[i].id}`;

            clone.lastElementChild.addEventListener( 
                "click",
                () => { update_setting_record( i ); }
            );

            settings_container_el.appendChild( clone );
        }

    } catch(error) {
        console.log("Error fetching settings: ", error);
    }
})();
