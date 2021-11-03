
class UsersPage extends React.Component {
    constructor(props) {
        super(props);

        this.edit_user_first_name = React.createRef();
        this.edit_user_last_name = React.createRef();
        this.edit_user_email = React.createRef();
        this.edit_user_is_admin = React.createRef();

        this.new_user_first_name = React.createRef();
        this.new_user_last_name = React.createRef();
        this.new_user_email = React.createRef();
        this.new_user_password = React.createRef();

    }

    state = {
        selected_user_id: undefined,
        users_array: []
    } 


    load_user_edit_form = (user_id) => {

        this.setState( {
            selected_user_id: user_id
        } );

        const selected_user = this.state.users_array.find( user => user.id === user_id);
        
        this.edit_user_first_name.current.value = selected_user.first_name;
        this.edit_user_last_name.current.value = selected_user.last_name;
        this.edit_user_email.current.value = selected_user.email;
        this.edit_user_is_admin.current.checked = selected_user.is_admin == "1" ? true : false;
    }

    update_user_data = ( event ) => {
        event.preventDefault();

        if ( this.state.selected_user_id === undefined ) { return; }

        fetch(`backend/users_controller.php/${this.state.selected_user_id}`, {
            method: "put",
            body: JSON.stringify( {
                first_name: this.edit_user_first_name.current.value,
                last_name: this.edit_user_last_name.current.value,
                email: this.edit_user_email.current.value,
                is_admin: this.edit_user_is_admin.current.checked ? "1" : "0"
            } )
        } )
        .then( () => {
            const users_array = this.state.users_array;
            const user_index = users_array.findIndex( user => user.id === this.state.selected_user_id );

            users_array[user_index].first_name = this.edit_user_first_name.current.value;
            users_array[user_index].last_name = this.edit_user_last_name.current.value;
            users_array[user_index].email = this.edit_user_email.current.value;
            users_array[user_index].is_admin = this.edit_user_is_admin.current.checked ? "1": "0";

            this.setState( {
                users_array: users_array
            } );

        } );

    }

    create_user = (event) => {
        event.preventDefault();

        fetch(`backend/register_controller.php`, {
            method: "post",
            body: JSON.stringify( {
                first_name: this.new_user_first_name.current.value,
                last_name: this.new_user_last_name.current.value,
                email: this.new_user_email.current.value,
                password: this.new_user_password.current.value
            } )
        } )
        .then( () => {
            console.log("Created a new user");
            this.fetch_users();
        } );
    }

    fetch_users = () => {
        fetch("backend/users_controller.php")
        .then( response => { return response.json(); } )
        .then( data => { 
            console.log( data );

            this.setState( {
                selected_user_id: data.length > 0 ? data[0] : undefined,
                users_array: data
            } );

        } );
    }

    render() {
        return (
            <React.Fragment>
                <section className="shared-section-container ">
                    <div className="shared-item-container">
                    {
                       
                        this.state.users_array.map( user => {
                            return ( <UserItem user={user} key={user.email} onClick={ () => this.load_user_edit_form(user.id) } /> )
                        } )
                       
                    }
                    </div>
                </section>
                
                <div className="flex-between">
                    <section className="shared-section-container ">
                        <h4 className="h4">Edit User Info </h4>
                        <form onSubmit={this.update_user_data}>
                            <div className="flex-between">
                                <label className="label">First Name</label>
                                <input type="text" name="first_name" className="input" ref={this.edit_user_first_name} placeholder="No user selected" />
                            </div>
                            <br />
                            <div className="flex-between">
                                <label className="label">Last Name</label>
                                <input type="text" name="last_name" className="input" ref={this.edit_user_last_name} placeholder="No user selected"/>
                            </div>
                            <br />
                            <div className="flex-between">
                                <label className="label" >Email</label>
                                <input type="email" name="email" className="input" ref={this.edit_user_email} placeholder="No user selected"/>
                            </div>
                            <br />
                            <label className="label"> Is Admin </label>
                            <input type="checkbox" name="is_admin" ref={this.edit_user_is_admin} />
                            <br />
                            <br />
                            <button type="submit"> Update User </button>
                        </form>
                    </section>

                    <section className="shared-section-container">
                        <h4 className="h4">Create A New User </h4>
                        <form onSubmit={this.create_user}>
                            <div className="flex-between">
                                <label className="label">First Name</label>
                                <input type="text" name="first_name" className="input" ref={this.new_user_first_name} placeholder="John" />
                            </div>
                            <br />
                            <div className="flex-between">
                                <label className="label">Last Name</label>
                                <input type="text" name="last_name" className="input" ref={this.new_user_last_name} placeholder="Smith" />
                            </div>
                            <br />
                            <div className="flex-between">
                                <label className="label" >Email</label>
                                <input type="email" name="email" className="input" ref={this.new_user_email} placeholder="johnsmith123@outlook.com" />
                            </div>
                            <br />
                            <div className="flex-between">
                                <label className="label" >Password </label>
                                <input type="password" name="new_password" className="input" ref={this.new_user_password}/>
                            </div>
                            <br />
                            <button type="submit"> Create User </button>
                        </form>
                    </section>
                </div>

            </React.Fragment>
        );
    }

    componentDidMount() {
        this.fetch_users();
    }
}

let domContainer = document.getElementById('app');
ReactDOM.render(<UsersPage />, domContainer);
