var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PagesPage = function (_React$Component) {
    _inherits(PagesPage, _React$Component);

    function PagesPage(props) {
        _classCallCheck(this, PagesPage);

        var _this = _possibleConstructorReturn(this, (PagesPage.__proto__ || Object.getPrototypeOf(PagesPage)).call(this, props));

        _this.state = {
            selected_page_id: undefined,
            selected_section_id: undefined,
            pages_array: [],
            sections_array: [],
            pell_text_editor: undefined
        };

        _this.delete_page = function (page_id) {
            if (confirm("Are you sure you want to delete this Page?") === false) {
                return;
            }

            fetch("backend/api.php/pages/" + page_id, {
                method: "delete"
            }).then(_this.fetch_pages); // I know this isnt performant...
        };

        _this.delete_section = function (section_id) {

            if (confirm("Are you sure you want to delete this Section?") === false) {
                return;
            }

            fetch("backend/api.php/sections/" + section_id, {
                method: "delete"
            }).then(_this.fetch_section); // I know this isnt performant...
        };

        _this.save_page_name = function (new_name) {

            fetch("backend/api.php/pages/" + _this.state.selected_page_id, {
                method: "put",
                body: JSON.stringify({
                    name: new_name
                })
            }).then(_this.fetch_pages); // I know this isnt performant...
        };

        _this.save_section_name = function (new_name) {

            fetch("backend/api.php/sections/" + _this.state.selected_section_id, {
                method: "put",
                body: JSON.stringify({
                    name: new_name
                })
            }).then(_this.fetch_sections); // I know this isnt performant...
        };

        _this.load_page_sections = function (page_id) {

            _this.state.pell_text_editor.lastElementChild.innerHTML = "";

            _this.setState({
                selected_page_id: page_id,
                selected_section_id: undefined
            });
        };

        _this.save_section_content = function () {

            var new_content = _this.state.pell_text_editor.lastElementChild.innerHTML;

            fetch("backend/api.php/sections/" + _this.state.selected_section_id, {
                method: "put",
                body: JSON.stringify({
                    content: new_content
                })
            });

            // We have Updated the Database, but now we update our state to match the Newly Saved Content
            var section_index = _this.state.sections_array.findIndex(function (section) {
                return section.id === _this.state.selected_section_id;
            });
            _this.state.sections_array[section_index].content = _this.state.pell_text_editor.lastElementChild.innerHTML;
        };

        _this.load_section_content = function (section_id) {

            _this.setState({
                selected_section_id: section_id
            });

            _this.state.pell_text_editor.lastElementChild.innerHTML = _this.state.sections_array.find(function (section) {
                return section.id === section_id;
            }).content;
        };

        _this.fetch_pages = function () {
            return new Promise(function (resolve, reject) {
                fetch("backend/api.php/pages").then(function (response) {
                    return response.json();
                }).then(function (data) {
                    console.log(data);

                    _this.setState({
                        selected_page_id: data.length > 0 ? data[0] : undefined,
                        pages_array: data
                    });

                    resolve();
                });
            });
        };

        _this.fetch_sections = function () {
            return new Promise(function (resolve, reject) {
                fetch("backend/api.php/sections").then(function (response) {
                    return response.json();
                }).then(function (data) {
                    console.log(data);

                    _this.setState({
                        selected_section_id: data.length > 0 ? data[0] : undefined,
                        sections_array: data
                    });

                    resolve();
                });
            });
        };

        _this.create_new_page = function (new_text) {

            /*
             * Note * new_text is already .trim() from the GhostItem Component
             */

            fetch("backend/api.php/pages", {
                method: "post",
                body: JSON.stringify({
                    name: new_text,
                    content: ""
                })
            }).then(function () {
                // We have Updated the Database, but now we update our state to match the Newly Created Page
                _this.fetch_pages();
            });
        };

        _this.create_new_section = function (new_text) {

            /*
             * Note * new_text is already .trim() from the GhostItem Component
             */

            fetch("backend/api.php/sections", {
                method: "post",
                body: JSON.stringify({
                    name: new_text,
                    content: "",
                    page_id: _this.state.selected_page_id
                })
            }).then(function () {
                // We have Updated the Database, but now we update our state to match the Newly Created Section 
                _this.fetch_sections();
            });
        };

        return _this;
    }

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
                        "h4",
                        { className: "h4" },
                        " Pages "
                    ),
                    React.createElement(
                        "div",
                        { className: "shared-item-container" },
                        React.createElement(GhostItem, { onCreate: this.create_new_page, text: "Create Page" }),
                        this.state.pages_array.map(function (page) {
                            return React.createElement(Item, {
                                name: page.name,
                                key: page.id,
                                selected: _this2.state.selected_page_id === page.id,
                                icon: "bi-layout-text-window-reverse",
                                onClick: function onClick() {
                                    return _this2.load_page_sections(page.id);
                                },
                                onDelete: function onDelete() {
                                    return _this2.delete_page(page.id);
                                },
                                onUpdated: _this2.save_page_name
                            });
                        })
                    )
                ),
                React.createElement(
                    "section",
                    { className: "shared-section-container" },
                    React.createElement(
                        "h4",
                        { className: "h4" },
                        "Edit Page Sections "
                    ),
                    React.createElement(
                        "div",
                        { className: "d-flex justify-between" },
                        React.createElement(
                            "div",
                            { id: "for-sections_array", className: "sections-selection" },
                            React.createElement(GhostItem, { onCreate: this.create_new_section, text: "Create Section", isThin: "true" }),
                            this.state.sections_array.filter(function (section) {
                                return section.page_id === _this2.state.selected_page_id;
                            }).map(function (section) {
                                return React.createElement(Item, {
                                    name: section.name,
                                    key: section.id,
                                    selected: _this2.state.selected_section_id === section.id,
                                    isThin: "true",
                                    column: "true",
                                    icon: "bi-text-paragraph",
                                    onClick: function onClick() {
                                        return _this2.load_section_content(section.id);
                                    },
                                    onDelete: function onDelete() {
                                        return _this2.delete_section(section.id);
                                    },
                                    onUpdated: _this2.save_section_name
                                });
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "sections-editor" },
                            React.createElement(
                                "button",
                                { className: "float-right", onClick: function onClick() {
                                        return _this2.save_section_content();
                                    } },
                                " Save Changes "
                            ),
                            React.createElement(
                                "div",
                                { id: "bind-section_content" },
                                " "
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this3 = this;

            Promise.all([this.fetch_pages(), this.fetch_sections()]).then(function (values) {
                console.log("Promise All Ended");

                _this3.setState({
                    selected_page_id: _this3.state.pages_array.length > 0 ? _this3.state.pages_array[0].id : undefined
                });
            });

            this.setState({

                pell_text_editor: pell.init({
                    element: document.getElementById('bind-section_content'),
                    onChange: function onChange() {},
                    defaultParagraphSeparator: 'div',
                    styleWithCSS: false,
                    actions: ['heading1', 'heading2', 'paragraph', 'bold', 'italic', 'underline', 'quote', 'olist', 'ulist', 'link'],
                    classes: {
                        actionbar: 'pell-actionbar',
                        button: 'pell-button',
                        content: 'pell-content',
                        selected: 'pell-button-selected'
                    }
                })

            });
        }
    }]);

    return PagesPage;
}(React.Component);

var domContainer = document.getElementById('app');
ReactDOM.render(React.createElement(PagesPage, null), domContainer);