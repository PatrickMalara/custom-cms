class Item extends React.Component {
    render() {

        const { name, icon, isThin, column, selected } = this.props;

        // This acts as a Default value for the Prop
        const thinStyle = isThin === undefined ? '': 'thin-item';
        const columnStyle = column === undefined ? '': 'column-item';
        const selectedStyle = selected ? 'selected-item' : '' ;

        return (
            <div className={`shared-item-card clickable ${thinStyle} ${columnStyle} ${selectedStyle}`} onClick={ this.props.onClick }>
                <i className={`bi ${icon}`}> </i>
                <span> { name } </span>
            </div>
        );
    }
}
