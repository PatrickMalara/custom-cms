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

        // We have Updated the Databse, but now we update our state to match the Newly Saved Content
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

    render() {
        return (
            <React.Fragment>
                <section className="shared-section-container ">
                    <h4 className="h4"> Pages </h4>
                    <div className="shared-item-container">
                    {
                       
                        this.state.pages_array.map( page => {
                            return ( 
                                <Item 
                                    name={page.name} 
                                    key={page.id} 
                                    selected={ this.state.selected_page_id === page.id }
                                    icon="bi-layout-text-window-reverse"
                                    onClick={ () => this.load_page_sections(page.id) } 
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
                            <div id="ghost-section-card" className="ghost-section-card"> New section </div>
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
