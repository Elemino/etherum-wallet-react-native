import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import autobind from 'autobind-decorator';
import { colors, measures } from '@common/styles';

@inject('prices')
@observer
export default class Panel extends React.Component {

    state = { amount: '' };

    get amount() {
        return this.state.amount;
    }
    
    @autobind
    onChange(value) {
        let { amount } = this.state;
        switch (value) {
            case 'erase':
                amount = amount.slice(0, amount.length-1);
                break;

            case '.':
                if (amount.indexOf('.') > -1) return;
                else if (!amount.length) amount += '0.';
                else amount += '.';
                break;

            default:
                if (amount === value) return;
                else if (amount === '0') amount = value;
                else amount += value;
                break;
        }
        this.setState({ amount });
    }

    render() {
        return (
            <View style={styles.container}>
                    <Text style={styles.txtAmount}>{this.state.amount || 0}</Text>
                    <Text style={styles.subtitle}>ETH</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtAmount: {
        fontSize: measures.fontSizeLarge,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: measures.fontSizeMedium,
        color: colors.gray
    }
});