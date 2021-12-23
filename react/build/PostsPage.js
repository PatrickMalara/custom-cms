var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagesPage = function (_React$Component) {
    _inherits(PagesPage, _React$Component);

    function PagesPage(props) {
        _classCallCheck(this, PagesPage);

        /*this.edit_user_first_name = React.createRef();
        this.edit_user_last_name = React.createRef();
        this.edit_user_email = React.createRef();
        this.edit_user_is_admin = React.createRef();
         this.new_user_first_name = React.createRef();
        this.new_user_last_name = React.createRef();
        this.new_user_email = React.createRef();
        this.new_user_password = React.createRef();
        */
        var _this = _possibleConstructorReturn(this, (PagesPage.__proto__ || Object.getPrototypeOf(PagesPage)).call(this, props));

        _this.state = {
            selected_page_id: undefined,
            pages_array: [],
            sections_array: []
        };

        _this.load_page_sections = function (page_id) {

            _this.setState({
                selected_page_id: page_id
            });

            /*
            const selected_user = this.state.users_array.find( user => user.id === user_id);
            
            this.edit_user_first_name.current.value = selected_user.first_name;
            this.edit_user_last_name.current.value = selected_user.last_name;
            this.edit_user_email.current.value = selected_user.email;
            this.edit_user_is_admin.current.checked = selected_user.is_admin == "1" ? true : false;
            */
        };

        _this.fetch_pages = function () {
            fetch("backend/api.php/pages").then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);

                _this.setState({
                    selected_page_id: data.length > 0 ? data[0] : undefined,
                    pages_array: data
                });
            });
        };

        return _this;
    }

    /*
    update_user_data = ( event ) => {
        event.preventDefault();
         if ( this.state.selected_user_id === undefined ) { return; }
         fetch(`backend/users_controller.php/${this.state.selected_user_id}`, {
            method: "put",
            body: JSON.stringify( {
                first_name: this.edit_user_first_name.current.value,
                last_name: this.edit_user_last_name.current.value,
                email: this.edit_user_email.current.value,
                is_admin: this.edit_user_is_admin.current.checked ? 1 : 0
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
    }*/

    _createClass(PagesPage, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "section",
                    { className: "shared-section-container " },
                    React.createElement(
                        "div",
                        { className: "shared-item-container" },
                        React.createElement(
                            "h4",
                            { className: "h4" },
                            " Pages "
                        ),
                        this.state.pages_array.map(function (page) {
                            return React.createElement(Item, { name: page.name, key: page.id, onClick: function onClick() {
                                    return _this2.load_page_sections(page.id);
                                } });
                        })
                    )
                ),
                React.createElement(
                    "section",
                    { className: "shared-section-container " },
                    React.createElement(
                        "h4",
                        { className: "h4" },
                        "Edit Page Sections "
                    )
                )
            );
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetch_pages();
        }
    }]);

    return PagesPage;
}(React.Component);

var domContainer = document.getElementById('app');
ReactDOM.render(React.createElement(PagesPage, null), domContainer);