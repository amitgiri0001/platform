// Copyright (c) 2016 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

import EmojiStore from 'stores/emoji_store.jsx';

import {FormattedMessage} from 'react-intl';

export default class EmojiPickerPreview extends React.Component {
    static propTypes = {
        emoji: React.PropTypes.object
    }

    render() {
        const emoji = this.props.emoji;

        if (emoji) {
            let name;
            let aliases;
            if (emoji.name) {
                // This is a custom emoji that matches the model on the server
                name = emoji.name;
                aliases = [emoji.name];
            } else {
                // This is a system emoji which only has a list of aliases
                name = emoji.aliases[0];
                aliases = emoji.aliases;
            }

            return (
                <div className='emoji-picker__preview'>
                    <img
                        className='emoji-picker__preview-image'
                        align='absmiddle'
                        src={EmojiStore.getEmojiImageUrl(emoji)}
                    />
                    <span className='emoji-picker__preview-name'>{name}</span>
                    <span className='emoji-picker__preview-aliases'>{aliases.map((alias) => ':' + alias + ':').join(' ')}</span>
                </div>
            );
        }

        return (
            <div className='emoji-picker__preview emoji-picker__preview-placeholder'>
                <FormattedMessage
                    id='emoji_picker.emojiPicker'
                    defaultMessage='Emoji Picker'
                />
            </div>
        );
    }
}