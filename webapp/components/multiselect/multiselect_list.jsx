// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {cmdOrCtrlPressed} from 'utils/utils.jsx';
import Constants from 'utils/constants.jsx';
const KeyCodes = Constants.KeyCodes;

import React from 'react';
import {FormattedMessage} from 'react-intl';

export default class MultiSelectList extends React.Component {
    constructor(props) {
        super(props);

        this.defaultOptionRenderer = this.defaultOptionRenderer.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.handleArrowPress = this.handleArrowPress.bind(this);

        this.state = {
            page: 0,
            selected: 0
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleArrowPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleArrowPress);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.options) === JSON.stringify(nextProps.options)) {
            return;
        }

        const options = this.getOptionsToDisplay(nextProps.options, this.state.page, nextProps.perPage);
        this.setState({selected: 0});
        if (options && options.length > 0) {
            this.props.onSelect(options[0]);
        }
    }

    getOptionsToDisplay(options, page, perPage) {
        if (options == null) {
            return [];
        }

        const pageStart = page * perPage;
        const pageEnd = pageStart + perPage;
        return options.slice(pageStart, pageEnd);
    }

    handleArrowPress(e) {
        if (cmdOrCtrlPressed(e) && e.shiftKey) {
            return;
        }

        const options = this.getOptionsToDisplay(this.props.options, this.state.page, this.props.perPage);
        let selected;

        switch (e.keyCode) {
        case KeyCodes.DOWN:
            selected = Math.min(this.state.selected + 1, options.length - 1);
            break;
        case KeyCodes.UP:
            selected = Math.max(this.state.selected - 1, 0);
            break;
        default:
            return;
        }

        this.setState({selected});
        this.props.onSelect(options[selected]);
    }

    nextPage() {
        if (this.props.onPageChange) {
            this.props.onPageChange(this.state.page + 1, this.state.page);
        }
        this.setState({page: this.state.page + 1, selected: 0});
    }

    prevPage() {
        if (this.state.page === 0) {
            return;
        }

        if (this.props.onPageChange) {
            this.props.onPageChange(this.state.page - 1, this.state.page);
        }
        this.setState({page: this.state.page - 1, selected: 0});
    }

    defaultOptionRenderer(option, isSelected, onAdd, buttonText) {
        const style = {width: '100%', margin: '15px'};
        if (isSelected) {
            style.backgroundColor = 'green';
        }

        return (
            <div
                style={style}
                key={'multiselectoption' + option.value}
            >
                {option.label}
                <button
                    className='btn btn-primary btn-sm'
                    style={{position: 'absolute', right: '0'}}
                    onClick={() => onAdd(option)}
                >
                    {buttonText}
                </button>
            </div>
        );
    }

    render() {
        const options = this.props.options;

        if (options == null) {
            return (
                <div
                    key='no-users-found'
                    className='no-channel-message'
                >
                    <p className='primary-message'>
                        <FormattedMessage
                            id='multiselect.list.notFound'
                            defaultMessage='No items found'
                        />
                    </p>
                </div>
            );
        }

        let optionsToDisplay = [];
        let nextButton;
        let previousButton;

        if (options.length > this.props.perPage) {
            const pageStart = this.state.page * this.props.perPage;
            const pageEnd = pageStart + this.props.perPage;
            optionsToDisplay = this.getOptionsToDisplay(options, this.state.page, this.props.perPage);

            if (options.length > pageEnd) {
                nextButton = (
                    <button
                        className='btn btn-default filter-control filter-control__next'
                        onClick={this.nextPage}
                    >
                        <FormattedMessage
                            id='filtered_user_list.next'
                            defaultMessage='Next'
                        />
                    </button>
                );
            }

            if (this.state.page > 0) {
                previousButton = (
                    <button
                        className='btn btn-default filter-control filter-control__prev'
                        onClick={this.prevPage}
                    >
                        <FormattedMessage
                            id='filtered_user_list.prev'
                            defaultMessage='Previous'
                        />
                    </button>
                );
            }
        } else {
            optionsToDisplay = options;
        }

        let renderer;
        if (this.props.optionRenderer) {
            renderer = this.props.optionRenderer;
        } else {
            renderer = this.defaultOptionRenderer;
        }

        const optionControls = optionsToDisplay.map((o, i) => renderer(o, this.state.selected === i, this.props.onAdd, this.props.buttonText));

        return (
            <div>
                {optionControls}
                <div className='filter-controls'>
                    {previousButton}
                    {nextButton}
                </div>
            </div>
        );
    }
}

MultiSelectList.defaultProps = {
    options: [],
    perPage: 50,
    onAction: () => null
};

MultiSelectList.propTypes = {
    options: React.PropTypes.arrayOf(React.PropTypes.object),
    optionRenderer: React.PropTypes.func,
    perPage: React.PropTypes.number,
    onPageChange: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    buttonText: React.PropTypes.node
};