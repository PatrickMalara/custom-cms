class GhostItem extends React.Component {
    constructor(props) {
        super(props);

        this.new_text = React.createRef();
    }

    state = {
        is_editing: false,
        new_text: "",
    } 

    toggle_transform = () => {
        this.setState( {
            is_editing: !this.state.is_editing
        } );
    }

    addition_clicked = () => {
        const new_text = this.new_text.current.value.trim();
        this.props.onCreate( new_text );

        this.setState( {
            is_editing: false 
        } );
    }

    render() {

        const { text, isThin } = this.props;

        const thinStyle = isThin === undefined ? '': 'thin-item';


        if ( this.state.is_editing === false ) {
            return (
                <div className={`shared-ghost-item-card clickable ${thinStyle}`} onClick={ this.toggle_transform}>
                    <i className="`bi bi-plus"> </i>
                    <span> { text } </span>
                </div>
            );
        } else if ( this.state.is_editing === true ) {
                return (
                    <div className={`shared-ghost-item-card clickable ${thinStyle}`} onMouseLeave={this.toggle_transform}>

                    <input id="new-page-text-input" ref={this.new_text} autoFocus tabIndex="0" className="form-control" placeholder="New..." />

                    <i onClick={ this.addition_clicked } className="bi bi-plus clickable-icon float-right ml-05 ghost-button" tabIndex="0"></i>
                    <i onClick={ this.toggle_transform } className="bi bi-arrow-left-short clickable-icon float-right ghost-button"></i>
                </div>
            );
        }

    }
}
