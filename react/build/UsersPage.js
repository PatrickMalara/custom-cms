var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UsersPage = function (_React$Component) {
    _inherits(UsersPage, _React$Component);

    function UsersPage(props) {
        _classCallCheck(this, UsersPage);

        var _this = _possibleConstructorReturn(this, (UsersPage.__proto__ || Object.getPrototypeOf(UsersPage)).call(this, props));

        _this.state = {
            selected_user_id: undefined,
            users_array: []
        };

        _this.load_user_edit_form = function (user_id) {

            _this.setState({
                selected_user_id: user_id
            });

            var selected_user = _this.state.users_array.find(function (user) {
                return user.id === user_id;
            });

            _this.edit_user_first_name.current.value = selected_user.first_name;
            _this.edit_user_last_name.current.value = selected_user.last_name;
            _this.edit_user_email.current.value = selected_user.email;
            _this.edit_user_is_admin.current.checked = selected_user.is_admin == "1" ? true : false;
        };

        _this.update_user_data = function (event) {
            event.preventDefault();

            if (_this.state.selected_user_id === undefined) {
                return;
            }

            fetch("backend/users_controller.php/" + _this.state.selected_user_id, {
                method: "put",
                body: JSON.stringify({
                    first_name: _this.edit_user_first_name.current.value,
                    last_name: _this.edit_user_last_name.current.value,
                    email: _this.edit_user_email.current.value,
                    is_admin: _this.edit_user_is_admin.current.checked ? 1 : 0
                })
            }).then(function () {
                var users_array = _this.state.users_array;
                var user_index = users_array.findIndex(function (user) {
                    return user.id === _this.state.selected_user_id;
                });

                users_array[user_index].first_name = _this.edit_user_first_name.current.value;
                users_array[user_index].last_name = _this.edit_user_last_name.current.value;
                users_array[user_index].email = _this.edit_user_email.current.value;
                users_array[user_index].is_admin = _this.edit_user_is_admin.current.checked ? "1" : "0";

                _this.setState({
                    users_array: users_array
                });
            });
        };

        _this.create_user = function (event) {
            event.preventDefault();

            fetch("backend/register_controller.php", {
                method: "post",
                body: JSON.stringify({
                    first_name: _this.new_user_first_name.current.value,
                    last_name: _this.new_user_last_name.current.value,
                    email: _this.new_user_email.current.value,
                    password: _this.new_user_password.current.value
                })
            }).then(function () {
                console.log("Created a new user");
                _this.fetch_users();
            });
        };

        _this.fetch_users = function () {
            fetch("backend/users_controller.php").then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);

                _this.setState({
                    selected_user_id: data.length > 0 ? data[0] : undefined,
                    users_array: data
                });
            });
        };

        _this.edit_user_first_name = React.createRef();
        _this.edit_user_last_name = React.createRef();
        _this.edit_user_email = React.createRef();
        _this.edit_user_is_admin = React.createRef();

        _this.new_user_first_name = React.createRef();
        _this.new_user_last_name = React.createRef();
        _this.new_user_email = React.createRef();
        _this.new_user_password = React.createRef();

        return _this;
    }

    _createClass(UsersPage, [{
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
                        this.state.users_array.map(function (user) {
                            return React.createElement(UserItem, { user: user, key: user.email, onClick: function onClick() {
                                    return _this2.load_user_edit_form(user.id);
                                } });
                        })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "flex-between" },
                    React.createElement(
                        "section",
                        { className: "shared-section-container " },
                        React.createElement(
                            "h4",
                            { className: "h4" },
                            "Edit User Info "
                        ),
                        React.createElement(
                            "form",
                            { onSubmit: this.update_user_data },
                            React.createElement(
                                "div",
                                { className: "flex-between" },
                                React.createElement(
                                    "label",
                                    { className: "label" },
                                    "First Name"
                                ),
                                React.createElement("input", { type: "text", name: "first_name", className: "input", ref: this.edit_user_first_name, placeholder: "No user selected" })
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "div",
                                { className: "flex-between" },
                                React.createElement(
                                    "label",
                                    { className: "label" },
                                    "Last Name"
                                ),
                                React.createElement("input", { type: "text", name: "last_name", className: "input", ref: this.edit_user_last_name, placeholder: "No user selected" })
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "div",
                                { className: "flex-between" },
                                React.createElement(
                                    "label",
                                    { className: "label" },
                                    "Email"
                                ),
                                React.createElement("input", { type: "email", name: "email", className: "input", ref: this.edit_user_email, placeholder: "No user selected" })
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "label",
                                { className: "label" },
                                " Is Admin "
                            ),
                            React.createElement("input", { type: "checkbox", name: "is_admin", ref: this.edit_user_is_admin }),
                            React.createElement("br", null),
                            React.createElement("br", null),
                            React.createElement(
                                "button",
                                { type: "submit" },
                                " Update User "
                            )
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "shared-section-container" },
                        React.createElement(
                            "h4",
                            { className: "h4" },
                            "Create A New User "
                        ),
                        React.createElement(
                            "form",
                            { onSubmit: this.create_user },
                            React.createElement(
                                "div",
                                { className: "flex-between" },
                                React.createElement(
                                    "label",
                                    { className: "label" },
                                    "First Name"
                                ),
                                React.createElement("input", { type: "text", name: "first_name", className: "input", ref: this.new_user_first_name, placeholder: "John" })
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "div",
                                { className: "flex-between" },
                                React.createElement(
                                    "label",
                                    { className: "label" },
                                    "Last Name"
                                ),
                                React.createElement("input", { type: "text", name: "last_name", className: "input", ref: this.new_user_last_name, placeholder: "Smith" })
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "div",
                                { className: "flex-between" },
                                React.createElement(
                                    "label",
                                    { className: "label" },
                                    "Email"
                                ),
                                React.createElement("input", { type: "email", name: "email", className: "input", ref: this.new_user_email, placeholder: "johnsmith123@outlook.com" })
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "div",
                                { className: "flex-between" },
                                React.createElement(
                                    "label",
                                    { className: "label" },
                                    "Password "
                                ),
                                React.createElement("input", { type: "password", name: "new_password", className: "input", ref: this.new_user_password })
                            ),
                            React.createElement("br", null),
                            React.createElement(
                                "button",
                                { type: "submit" },
                                " Create User "
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetch_users();
        }
    }]);

    return UsersPage;
}(React.Component);

var domContainer = document.getElementById('app');
ReactDOM.render(React.createElement(UsersPage, null), domContainer);