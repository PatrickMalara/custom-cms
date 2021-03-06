class PagesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        selected_page_id: undefined,
        selected_section_id: undefined,
        pages_array: [],
        sections_array: [],
        pell_text_editor: undefined
    } 

    delete_page = ( page_id ) => {
        if ( confirm( "Are you sure you want to delete this Page?") === false ) {
            return;
        }


        fetch(`backend/api.php/pages/${page_id}`, {
            method: "delete"
        })
        .then( this.fetch_pages );  // I know this isnt performant...
    }

    delete_section = ( section_id ) => {

        if ( confirm( "Are you sure you want to delete this Section?") === false ) {
            return;
        }

        fetch(`backend/api.php/sections/${section_id}`, {
            method: "delete"
        })
        .then( this.fetch_section);  // I know this isnt performant...
    }

    save_page_name = (new_name) => {

       fetch(`backend/api.php/pages/${this.state.selected_page_id}`, {
            method: "put",
            body: JSON.stringify( {
                name: new_name
            } )
        })
        .then( this.fetch_pages );  // I know this isnt performant...
 
    }

    save_section_name = (new_name) => {

       fetch(`backend/api.php/sections/${this.state.selected_section_id}`, {
            method: "put",
            body: JSON.stringify( {
                name: new_name
            } )
        })
        .then( this.fetch_sections);  // I know this isnt performant...
 
    }

    load_page_sections = (page_id) => {

        this.state.pell_text_editor.lastElementChild.innerHTML = "";

        this.setState( {
            selected_page_id: page_id,
            selected_section_id: undefined 
        } );

    }

    save_section_content = () => {

        const new_content = this.state.pell_text_editor.lastElementChild.innerHTML;

        fetch(`backend/api.php/sections/${this.state.selected_section_id}`, {
            method: "put",
            body: JSON.stringify( {
                content: new_content 
            } )
        });

        // We have Updated the Database, but now we update our state to match the Newly Saved Content
        const section_index = this.state.sections_array.findIndex( section => section.id === this.state.selected_section_id );
        this.state.sections_array[ section_index ].content = this.state.pell_text_editor.lastElementChild.innerHTML

    }

    load_section_content = (section_id) => {

        this.setState( {
            selected_section_id: section_id
        } );

        this.state.pell_text_editor.lastElementChild.innerHTML = this.state.sections_array.find( section => section.id === section_id ).content;

    }

    fetch_pages = () => {
        return new Promise( (resolve, reject) => {
            fetch("backend/api.php/pages")
            .then( response => { return response.json(); } )
            .then( data => { 
                console.log( data );

                this.setState( {
                    selected_page_id: data.length > 0 ? data[0] : undefined,
                    pages_array: data
                } );

                resolve();

            } );
        } );
    }

    fetch_sections = () => {
        return new Promise( (resolve, reject) => {
            fetch("backend/api.php/sections")
            .then( response => { return response.json(); } )
            .then( data => {
                console.log( data );

                this.setState( {
                    selected_section_id: data.length > 0 ? data[0] : undefined,
                    sections_array: data
                } );


                resolve();
            } );
        } );
    }

    create_new_page = (new_text) => {

        /*
         * Note * new_text is already .trim() from the GhostItem Component
         */

        fetch(`backend/api.php/pages`, {
            method: "post",
            body: JSON.stringify( {
                name: new_text,
                content: ""
            } )
        }).then( () => {
            // We have Updated the Database, but now we update our state to match the Newly Created Page
            this.fetch_pages();
        } ) ;
        
    }

    create_new_section = (new_text) => {

        /*
         * Note * new_text is already .trim() from the GhostItem Component
         */

        fetch(`backend/api.php/sections`, {
            method: "post",
            body: JSON.stringify( {
                name: new_text,
                content: "",
                page_id: this.state.selected_page_id
            } )
        }).then( () => {
            // We have Updated the Database, but now we update our state to match the Newly Created Section 
            this.fetch_sections();
        } ) ;
        
    }

    render() {
        return (
            <React.Fragment>
                <section className="shared-section-container ">
                    <h4 className="h4"> Pages </h4>
                    <div className="shared-item-container">
                    <GhostItem onCreate={this.create_new_page } text="Create Page" />
                    {
                       
                        this.state.pages_array.map( page => {
                            return ( 
                                <Item 
                                    name={page.name} 
                                    key={page.id} 
                                    selected={ this.state.selected_page_id === page.id }
                                    icon="bi-layout-text-window-reverse"
                                    onClick={ () => this.load_page_sections(page.id) } 
                                    onDelete={ () => this.delete_page(page.id) } 
                                    onUpdated={ this.save_page_name } 
                                /> 
                            )
                        } )
                       
                    }
                    </div>
                </section>
                
                <section className="shared-section-container">
                    <h4 className="h4">Edit Page Sections </h4>
                    <div className="d-flex justify-between"> 
                        <div id="for-sections_array" className="sections-selection">
                            <GhostItem onCreate={this.create_new_section } text="Create Section" isThin="true" />
                            {
                               
                                this.state.sections_array
                                .filter( section => section.page_id === this.state.selected_page_id  )
                                .map( section => {
                                    return ( 
                                        <Item 
                                            name={section.name} 
                                            key={section.id} 
                                            selected={ this.state.selected_section_id === section.id }
                                            isThin="true"
                                            column="true"
                                            icon="bi-text-paragraph"
                                            onClick={ () => this.load_section_content(section.id) } 
                                            onDelete={ () => this.delete_section(section.id) } 
                                            onUpdated={ this.save_section_name } 
                                        /> 
                                    )
                                } )
                               
                            }
                        </div>
                        <div className="sections-editor">
                            <button className="float-right" onClick={ () => this.save_section_content() }> Save Changes </button>
                            <div id="bind-section_content"> </div>
                        </div>
                    </div>
                </section>

            </React.Fragment>
        );
    }

    componentDidMount() {
        Promise.all( [ this.fetch_pages(), this.fetch_sections() ] ).then( values => {
            console.log("Promise All Ended");

            this.setState( {
                selected_page_id: this.state.pages_array.length > 0 ? this.state.pages_array[0].id : undefined
            } )

        } )

        this.setState( {

            pell_text_editor: pell.init({
              element: document.getElementById('bind-section_content'),
              onChange: () => {},
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
            })

        } );
    }
}

let domContainer = document.getElementById('app');
ReactDOM.render(<PagesPage />, domContainer);
