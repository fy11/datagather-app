
import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native';

import {BaseDialog} from 'react-native-pickers';

class ConfirmDialog extends BaseDialog {

    static defaultProps = {
        messageText: 'Alert Message',
        messageTextColor: '#444444',
        messageTextSize: 14,
        negativeText: 'cancel',
        negativeColor: '#666666',
        negativeSize: 16,
        positiveText: 'ok',
        positiveColor: '#1097D5',
        positiveSize: 16,
        onPress: null
    }

    constructor(props) {
        super(props);
    }

    _getContentPosition() {
        return { justifyContent: 'center', alignItems: 'center' }
    }

    renderContent() {
        return <View style={{
            height: this.getSize(150), width: this.getSize(307),
            backgroundColor: '#ffffff', borderRadius: this.getSize(6)
        }}>
            <View style={{
                width: this.getSize(307), flex: 1, paddingLeft: this.getSize(15), paddingRight: this.getSize(15),
                justifyContent: 'center', alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: this.props.messageTextSize, fontWeight: '100', color: this.props.messageTextColor,
                    lineHeight: this.getSize(20), textAlign: 'center',
                }}>{this.props.messageText}</Text>
                <TextInput ref={ref => this.textInput = ref}
                    style={{
                        width: this.getSize(200), marginTop:20,
                        height: this.getSize(40), color: '#333333', fontSize: this.getSize(14),
                        borderWidth: 1, borderColor: '#E8EEF0', backgroundColor: '#ffffff', borderRadius: this.getSize(4),
                        paddingLeft: this.getSize(15), paddingRight: this.getSize(15), paddingTop: this.getSize(10)
                    }}
                    numberOfLines={4}
                    value={this.state.text}
                    underlineColorAndroid={'transparent'}
                    placeholder={this.props.placeholder}
                    placeholderTextColor='#999999'
                    onChangeText={(text) => {
                        this.inputText = text;
                    }}
                />
            </View>
            <View style={{ width: this.getSize(307), height: 0.5, backgroundColor: '#e6e6e6' }} />
            <View style={{
                height: this.getSize(45),
                width: this.getSize(307),
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                <TouchableOpacity
                    onPress={() => {
                        this.dismiss(() => {
                            if (this.props.onPress) {
                                this.props.onPress(true,this.inputText);
                            }
                        });
                    }}
                    style={{
                        flex: 1, height: this.getSize(45),
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                    <Text style={{ color: this.props.positiveColor, fontSize: this.props.positiveSize }}>
                        {this.props.positiveText}
                    </Text>
                </TouchableOpacity>
                <View style={{
                    height: this.getSize(28), width: this.mOnePixel, backgroundColor: '#e6e6e6'
                }} />
                <TouchableOpacity
                    onPress={() => {
                        this.dismiss(() => {
                            if (this.props.onPress) {
                                this.props.onPress(false);
                            }
                        });
                    }}
                    style={{
                        flex: 1, height: this.getSize(45),
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                    <Text style={{ color: this.props.negativeColor, fontSize: this.props.negativeSize }}>{this.props.negativeText}</Text>
                </TouchableOpacity>
            </View>
        </View >
    }

}

export default ConfirmDialog;