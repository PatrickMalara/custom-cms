const state = {
    posts_array: [],

    save_post_content_timeout: undefined,

    text_editor: pell.init({
      element: document.getElementById('bind-post_content'),
      onChange: function( editor_html_content ) { 
            clearTimeout( state.save_post_content_timeout );
            state.save_post_content_timeout = setTimeout( async function() {
                fetch( `backend/api.php/posts/${state.selected_post_id}`, {
                    method: "put",
                    body: JSON.stringify( {
                        content: editor_html_content
                    } )
                } );
                console.log("Autosaving ...");
            } , 500, editor_html_content );
        },
      defaultParagraphSeparator: 'div',
      styleWithCSS: false,
      actions: [
        'heading1', 'heading2', 'paragraph', 'bold', 'italic', 'underline', 'quote', 'olist', 'ulist', 'link',
/*              {
          name: 'custom',
          icon: `<i class="bi bi-image"></i>`,
          title: 'Custom Action',
          result: () => console.log('Do something!')
        },
*/
      ],
      classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
      }
    }),

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

        response = await fetch("backend/api.php/posts");
        state.posts_array = await response.json();

        const posts_container_el = document.getElementById("posts-container");

        // Append: Ghost Post Button 
        const ghost_post_component = document.getElementById("ghost-post-component");
        const ghost_post_clone = ghost_post_component.content.firstElementChild.cloneNode(true);
        posts_container_el.appendChild( ghost_post_clone );


        // Append: Post Buttons
        const post_component = document.getElementById("post-component");
        const clone = post_component.content.cloneNode(true);
        for (let i = 0; i < state.posts_array.length; i += 1) {

            const clone = post_component.content.firstElementChild.cloneNode(true);
            console.log(`Clone${i}`, clone);

            clone.lastElementChild.textContent = state.posts_array[i].name;

/*
            clone.lastElementChild.addEventListener( 
                "click",
                () => { update_setting_record( i ); }
            );
*/

            posts_container_el.appendChild( clone );
        }


        if ( state.posts_array.length !== 0) {
            state.selected_post_id = state.posts_array[0].id;
            state.text_editor.lastElementChild.innerHTML = state.posts_array[0].content;
        }
        

    } catch(error) {
        console.log("Error fetching settings: ", error);
    }

})();
