<?php include 'header.php'; ?>

    <main>

        <section class="topbar"> 
        
            <i class="bi bi-layout-text-window-reverse"> </i>

            <h3> Editing <span id="current-page-name" style="color: purple;"> Home <span> </h3>

            <h3> 👋 Welcome, <?php echo $user_full_name; ?> </h3>

        </section>
        <div style="display:flex; justify-content: end;">
            <a href="backend/logout_controller.php" class="logout-text-btn">Logout</a>
        </div>


        <section class="pages-section" >

            <h3> Pages </h3>

            <br />

            <div id="for-pages_array" class="item-container">
            </div>
            
        </section>


        <section class="sections-section" >

            <h3> Sections </h3>

            <br />

            <div class="sections-container">
                <div id="for-sections_array" class="sections-selection">
                    <div id="ghost-section-card" class="ghost-section-card"> New section </div>
                </div>

                <div class="sections-editor">
                    <button onclick="update_section_record_content()" class="" style="float: right; margin-top: -2.5rem;"> Save Changes </button>
                    <div id="bind-selected_section_content"> </div>
                </div>
            </div>
            
        </section>

    </main>


    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

    <script> 

    const quill_text_editor = new Quill('#bind-selected_section_content', {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      placeholder: 'Section text',
      theme: 'snow'  // or 'bubble'
    });

    const state = {
        currently_selected_page_id:     -1,
        currently_selected_section_id:  -1,
        pages_array:                    [],
        sections_array:                 [],

        user_is_creating_a_section:     false,
        user_is_creating_a_page:        false,

        set_current_selected_page_id: async function( new_page_id ) {
            this.currently_selected_page_id = new_page_id;

            document.getElementById("current-page-name").innerHTML = this.pages_array.find( p => p.id === new_page_id.toString() ).name;

            // fetch all the sections for this page
            const results = await ( await fetch( `backend/api.php/sections` ) ).json();


            // @TODO Update the API to handle specific queries
            this.sections_array = results.filter( section => section.page_id === new_page_id );
            
            console.log( this.sections_array );

            // Render all of the new Section Elements
            const sections_dom = document.getElementById( "for-sections_array" );

            console.log(sections_dom);
            console.log( this.sections_array.length );

            console.log( "first child: ", sections_dom.firstChild );

            while ( sections_dom.firstChild !== null ) {
                sections_dom.removeChild( sections_dom.firstChild );
            }

            sections_dom.appendChild( 
                build_ghost_section_element()
            );

            for (let i = 0; i < this.sections_array.length; i += 1) {
                console.log( "appending" );
            
                sections_dom.appendChild( 
                    build_section_element(
                        this.sections_array[i].name,
                        this.sections_array[i].content,
                        this.sections_array[i].id  ) 
                );

            }

        },

        set_current_selected_section_id: function( new_section_id ) {

            this.currently_selected_section_id = new_section_id

            const editor_dom = document.getElementById( "bind-selected_section_content" ).firstChild;

            editor_dom.innerHTML = "<p>" + this.sections_array.find( section => section.id === new_section_id ).content + "</p>";

        }
    }



    async function update_section_record_content() {

        const new_content = quill_text_editor.getText().trim();

        let response = {};

        try {
            await fetch(`backend/api.php/sections/${state.currently_selected_section_id}`, {
                method: "put",
                body: JSON.stringify( {
                    content: new_content 
                } )
            });

            //It updated successfully, now lets save the changes locally
            state.sections_array.find( section => section.id === state.currently_selected_section_id ).content = new_content;

        } catch(error) {
            console.error(`Error Updating the Section ${state.currently_selected_section_id}`, error);
        }
    }


    function reset_ghost_section_card() {

        const ghost_section_element = document.getElementById( "ghost-section-card" );

        ghost_section_element.innerHTML = build_ghost_section_element().innerHTML; 

        // Because of Event Propigation, we have to wait for 
        // The Ghost Elements eventListener to finish
        setTimeout( function() {
            state.user_is_creating_a_section = false;
        }, 100 );

    }


    async function delete_section_record( section_id ) {


        // our section_id is passed down as props to our function as a Number...
        const section_name = state.sections_array.find( section => section.id === section_id.toString() ).name;

        if ( confirm( `Are you sure you want to delete Section: ${section_name}?` ) === false ) {
            return;
        }
        

        let response = undefined;

        try { 
            response = await fetch(`backend/api.php/sections/${section_id}`, {
                method: "delete",
            });


            response = await response.text();

            console.log(response);

            // Re render the sections for the current page
            state.set_current_selected_page_id( state.currently_selected_page_id );

            // Made sure that our editor is not rendering the text from the now deleted Section, 
            state.set_current_selected_section_id( state.sections_array[0].id );
            
        } catch(error) {
            console.error(error);
        }
    }


    async function delete_page_record( page_id ) {


        // our page_id is passed down as props to our function as a Number...
        const page_name = state.pages_array.find( page => page.id === page_id.toString() ).name;

        if ( confirm( `Are you sure you want to delete Page: ${page_name}?` ) === false ) {
            return;
        }
        

        let response = undefined;

        try { 
            response = await fetch(`backend/api.php/pages/${page_id}`, {
                method: "delete",
            });


            response = await response.text();

            console.log(response);


            const pages_element = document.getElementById( "for-pages_array" );

            const page_element_to_remove = Object.values( pages_element.children ).find( page_el => page_el.dataset.id === page_id.toString() );

            pages_element.removeChild( page_element_to_remove );
            

            state.pages_array.splice( state.pages_array.findIndex( p => p.id === page_id.toString() ), 1 );

            
        } catch(error) {
            console.error(error);
        }
    }

    
    async function create_page_record() {

        console.log( "Creating a new record!!!" );

        const text_input = document.getElementById( "new-page-text-input" );

        let response = await fetch("backend/api.php/pages", {
            method: "post",
            body: JSON.stringify( {
                name: text_input.value.trim(),
                content: "",
            } )
            
        });

        const new_page_id = ( await response.json() ).toString();

        state.user_is_creating_a_page = false;
        state.set_current_selected_page_id( state.currently_selected_page_id );
        reset_ghost_page_card();


        state.pages_array.push( {
            name: text_input.value.trim(),
            content: "",
            id: new_page_id 
        } );

        // Create the new Page Element and append it to the pages section
        document.getElementById( "for-pages_array" ).appendChild(
            build_page_element( text_input.value.trim(), "", new_page_id )
        );

    
    }


    async function create_section_record() {

        console.log( "Creating a new record!!!" );

        const text_input = document.getElementById( "new-section-text-input" );

        let response = await fetch("backend/api.php/sections", {
            method: "post",
            body: JSON.stringify( {
                name: text_input.value.trim(),
                content: "",
                page_id: state.currently_selected_page_id
            } )
            
        });

        console.log( (await response.text()) );

        state.user_is_creating_a_section = false;
        state.set_current_selected_page_id( state.currently_selected_page_id );

    }

    async function update_page_record_name( page_id ) {
        const page_elements_array = Object.values(document.getElementsByClassName( "page-card" ));

        const page_element_to_reset = page_elements_array.find( ( page_el ) =>  page_el.dataset.id === page_id.toString() );

        const page_element_text_box = Object.values(page_element_to_reset.children).find( child => child.nodeName = "INPUT");


        let response = {};

        try {
            response = await fetch( `backend/api.php/pages/${page_id}`, {
                method: "put",
                body: JSON.stringify( {
                    name: page_element_text_box.value.trim()
                } )
            } );

        } catch(error) {
            console.error(error);
        }


        state.pages_array.find( page => page.id === page_id.toString() ).name = page_element_text_box.value.trim();
        const temp_el = build_page_element( page_element_text_box.value.trim(), "", page_id ); 

        page_element_to_reset.innerHTML = temp_el.innerHTML;

    }


    async function update_section_record_name( section_id ) {
        const section_elements_array = Object.values(document.getElementsByClassName( "section-card" ));

        const section_element_to_reset = section_elements_array.find( ( section_el ) =>  section_el.dataset.id === section_id.toString() );

        const section_element_text_box = Object.values(section_element_to_reset.children).find( child => child.nodeName = "INPUT");


        let response = {};

        try {
            response = await fetch( `backend/api.php/sections/${section_id}`, {
                method: "put",
                body: JSON.stringify( {
                    name: section_element_text_box.value.trim()
                } )
            } );

        } catch(error) {
            console.error(error);
        }


        state.sections_array.find( section => section.id === section_id.toString() ).name = section_element_text_box.value.trim();
        const temp_el = build_section_element( section_element_text_box.value.trim(), "", section_id ); 

        section_element_to_reset.innerHTML = temp_el.innerHTML;

    }



    function reset_ghost_page_card() {

        const ghost_page_element = document.getElementById( "ghost-page-card" );

        ghost_page_element.innerHTML = build_ghost_page_element().innerHTML;

        // Because of Event Propigation, we have to wait for 
        // The Ghost Elements eventListener to finish
        setTimeout( function() {
            state.user_is_creating_a_page = false;
        }, 100 );

    }

    function reset_page_card( page_id ) {
        const page_elements_array = Object.values(document.getElementsByClassName( "page-card" ));

        const page_element_to_reset = page_elements_array.find( page_el =>  page_el.dataset.id === page_id.toString() );

        const page_name = state.pages_array.find( page => page.id === page_id.toString() ).name;

        const temp_el = build_page_element( page_name, "", page_id ); 

        page_element_to_reset.innerHTML = temp_el.innerHTML;

    }

    function reset_section_card( section_id ) {
        const section_elements_array = Object.values(document.getElementsByClassName( "section-card" ));

        const section_element_to_reset = section_elements_array.find( ( section_el ) =>  section_el.dataset.id === section_id.toString() );

        const section_name = state.sections_array.find( section => section.id === section_id.toString() ).name;

        const temp_el = build_section_element( section_name, "", section_id ); 

        section_element_to_reset.innerHTML = temp_el.innerHTML;

    }


    function transform_ghost_page_element() {
        const ghost_element = document.getElementById( "ghost-page-card" );

        ghost_element.innerHTML = `

            <input id="new-page-text-input" autofocus name="new_page_name" tabindex="0" class="form-control" placeholder="Page Name.." />

            <i onclick="create_page_record()" tabindex="0" class="bi bi-plus clickable-icon" style="float: right; margin-left: calc( 0.5rem ); margin-top: 0px;"></i>
            <i onclick="reset_ghost_page_card()" class="bi bi-arrow-left-short clickable-icon" style="float: right; margin-top: 0px;"></i>
        `;

        document.getElementById( "new-page-text-input" ).focus();
    }


    function transform_page_element_for_editing( page_id) {


        const page_elements_array = Object.values(document.getElementsByClassName( "page-card" ));

        const page_element_to_transform = page_elements_array.find( page_el => page_el.dataset.id === page_id.toString() );

        const page_name = state.pages_array.find( page => page.id === page_id.toString() ).name; 

        page_element_to_transform.innerHTML = `
            <input id="editing-page-text-input" autofocus name="new_page_name" tabindex="0" class="form-control" value="${page_name}" />

            <i onclick="update_page_record_name(${page_id})" tabindex="0" class="bi bi-check clickable-icon" style="float: right; margin-left: calc( 0.5rem ); margin-top: 0px;"></i>
            <i onclick="reset_page_card(${page_id})" class="bi bi-arrow-left-short clickable-icon" style="float: right; margin-top: 0px;"></i>
        `;


        document.getElementById( "editing-page-text-input" ).focus();
    }


    function transform_section_element_for_editing( section_id) {


        const section_elements_array = Object.values(document.getElementsByClassName( "section-card" ));

        const section_element_to_transform = section_elements_array.find( ( section_el ) =>  section_el.dataset.id === section_id.toString() );

        const section_name = state.sections_array.find( section => section.id === section_id.toString() ).name; 

        section_element_to_transform.innerHTML = `
            <input id="editing-section-text-input" autofocus name="new_section_name" tabindex="0" class="form-control" value="${section_name}" />

            <i onclick="update_section_record_name(${section_id})" tabindex="0" class="bi bi-check clickable-icon" style="float: right; margin-left: calc( 0.5rem ); margin-top: 0px;"></i>
            <i onclick="reset_section_card(${section_id})" class="bi bi-arrow-left-short clickable-icon" style="float: right; margin-top: 0px;"></i>
        `;


        document.getElementById( "editing-section-text-input" ).focus();
    }
    

    function transform_ghost_section_element() {

        console.warn("Transforming ghost!!!!");

        const ghost_dom = document.getElementById( "ghost-section-card" );
    
        ghost_dom.innerHTML = `

            <input id="new-section-text-input" autofocus name="new_section_name" tabindex="0" class="form-control" placeholder="Section Name.." />

            <i onclick="create_section_record()" tabindex="0" class="bi bi-plus clickable-icon" style="float: right; margin-left: calc( 0.5rem ); margin-top: 0px;"></i>
            <i onclick="reset_ghost_section_card()" class="bi bi-arrow-left-short clickable-icon" style="float: right; margin-top: 0px;"></i>
        `;

        document.getElementById( "new-section-text-input" ).focus();
    }


    function build_ghost_section_element() {

        const ghost_section_element = document.createElement("div");

        ghost_section_element.id = 'ghost-section-card';
        ghost_section_element.classList.add( 'ghost-section-card' );
        ghost_section_element.classList.add( 'clickable' );
        ghost_section_element.innerHTML = `
            New Section
            <i class="bi bi-plus" style="float: right; margin-top: -1px;"> </i> 
        `; 

        ghost_section_element.addEventListener(
            "click",
            () => { 
                if ( state.user_is_creating_a_section === false ) {
                    state.user_is_creating_a_section = true;
                    transform_ghost_section_element(); 
                }
            }
        );

        return ghost_section_element;
    }


    function build_ghost_page_element() {

        const ghost_page_element = document.createElement("div");

        ghost_page_element.id = 'ghost-page-card';
        ghost_page_element.classList.add( 'ghost-page-card' );
        ghost_page_element.classList.add( 'clickable' );
        ghost_page_element.innerHTML = `
            New Page
            <i class="bi bi-plus" style="float: right; margin-top: -1px;"> </i> 
        `; 

        ghost_page_element.addEventListener(
            "click",
            () => { 
                if ( state.user_is_creating_a_page === false ) {
                    state.user_is_creating_a_page = true;
                    transform_ghost_page_element(); 
                }
            }
        );

        return ghost_page_element;
    }


    function build_section_element(section_name, section_content, section_id) {
        const new_section_element = document.createElement("span");

        new_section_element.classList.add( 'section-card' );
        new_section_element.classList.add( 'clickable' );
        new_section_element.innerHTML = `
            <i class="bi bi-text-paragraph"> </i> 
            ${section_name}
            <i onclick="delete_section_record(${section_id})" class="bi bi-trash item-card-icon" style="margin-left: 0.5rem;"> </i> 
            <i onclick="transform_section_element_for_editing(${section_id})" class="bi bi-pencil item-card-icon"> </i> 
        `; 
        new_section_element.dataset.id = section_id;

        new_section_element.addEventListener(
            "click",
            () => { state.set_current_selected_section_id( section_id ) }
        );

        return new_section_element;
    }


    function build_page_element(page_name, page_content, page_id) {
        const new_page_element = document.createElement("div");

        new_page_element.classList.add( "clickable" );
        new_page_element.classList.add( "item-card" );
        new_page_element.classList.add( "page-card" );
        new_page_element.dataset.id = page_id;
        new_page_element.tabIndex = 0; 

        new_page_element.innerHTML = `
            <i class="bi bi-layout-text-window-reverse"> </i>
            <span> ${page_name} </span>
            <i onclick="delete_page_record(${page_id})" class="bi bi-trash item-card-icon" style="margin-left: 0.5rem;"> </i> 
            <i onclick="transform_page_element_for_editing(${page_id})" class="bi bi-pencil item-card-icon"> </i> 
        `;

        new_page_element.addEventListener(
            "click", 
            () => { state.set_current_selected_page_id( page_id ) }
        ); 

        return new_page_element;
    }



    (async function main() {

        let pages_dom = document.getElementById("for-pages_array");
        pages_dom.appendChild( build_ghost_page_element() );

        let response = {};

        try {
            response = await fetch(`backend/api.php/pages`);
            response = await response.json();

            for (let i = 0; i < response.length; i += 1) {

                let new_page_element = build_page_element( 
                    response[i].name, "", response[i].id
                );

                pages_dom.appendChild( new_page_element );
            }

            console.log( "Getting Pages Response: ", response);
        } catch (error) {
            console.error(error);

            return;
        }

        if ( response.length === 0) {
            return;
        }


        state.pages_array = response;
        await state.set_current_selected_page_id( response[0].id );
        state.set_current_selected_section_id( state.sections_array[0].id );

    })();

    </script>
    
  </body>
</html>
