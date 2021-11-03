class UserItem extends React.Component {
    render() {

        const { first_name, last_name } = this.props.user;

        return (
            <div className="shared-item-card clickable" onClick={ this.props.onClick }>
                <span> { first_name } { last_name } </span>
            </div>
        );
    }
}
