class Item extends React.Component {
    constructor(props) {
        super(props);

        this.new_name = React.createRef();
    }

    state = {
        is_hover: false,
        is_editing: false,
        new_text: "",
    } 

    toggle_editing = () => {
        this.setState( {
            is_editing: !this.state.is_editing,
            is_hover: false
        }, () => {

            if ( this.state.is_editing === true ) {
                console.log( this.props.name );
                this.new_name.current.value = this.props.name;
            }

        } );

        
    }

    onUpdated = () => {
        this.props.onUpdated( this.new_name.current.value.trim() );

        this.setState( {
            is_editing: false,
            is_hover: false
        } )
    }


    /*
     * I know I can do this with just CSS
     * however, I think Its best to keep an internal
     * state in case I want to make this components
     * customizable in the future...
     */
    toggleHover = () => {
        this.setState( {
            is_hover: !this.state.is_hover
        } );

    }

    render() {

        const { name, icon, isThin, column, selected } = this.props;

        // This acts as a Default value for the Prop
        const thinStyle = isThin === undefined ? '': 'thin-item';
        const columnStyle = column === undefined ? '': 'column-item';
        const selectedStyle = selected ? 'selected-item' : '' ;


        // Conditional Rendering
        let hover = "";
        if ( this.state.is_hover === true ) {
            hover = (
                <React.Fragment>
                    <i onClick={ this.props.onDelete } className="bi bi-trash float-right item-card-icon ml-05"> </i> 
                    <i onClick={ this.toggle_editing } className="bi bi-pencil float-right item-card-icon"> </i>
                </React.Fragment>
            )
        }


        if ( this.state.is_editing === false ) {
            return (
                <div className={`shared-item-card clickable ${thinStyle} ${columnStyle} ${selectedStyle}`} 
                 onMouseEnter={ this.toggleHover } 
                 onMouseLeave={ this.toggleHover } 
                 onClick={ this.props.onClick }>

                    <i className={`bi ${icon}`}> </i>
                    <span> { name } </span>
                    
                    {hover}

                </div>
            );
        } else {
            return (
                <div className={`shared-item-card clickable ${thinStyle} ${columnStyle} ${selectedStyle}`}
                 onMouseLeave={ this.toggle_editing} >

                    <input ref={this.new_name} autoFocus tabIndex="0" className="form-control" placeholder="New..."/>

                    <i onClick={ this.onUpdated } className="bi bi-check clickable-icon float-right ml-05 ghost-button" tabIndex="0"></i>
                    <i onClick={ this.toggle_editing } className="bi bi-arrow-left-short clickable-icon float-right ghost-button"></i>


                </div>
            );
        } 

        
    }
}
