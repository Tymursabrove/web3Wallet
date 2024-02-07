import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { useWalletConnect } from '@walletconnect/react-native-dapp';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const connector = useWalletConnect();

  const connectWallet = React.useCallback(async (data) => {
   
    const con = await connector.connect();
    console.log(con);
    
  }, [connector]);

  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }
  
    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    console.log(accounts);
    console.log(chainId);
  });

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  const payDrink = React.useCallback(async (data) => {
    try {
       const tx = await connector.sendTransaction({
        data: '0x', //data drink
        from: "0x31e3239f5305a26672a5923cd2439e1c936a4921",
        to: '0xBcC732b0acE59557FE2C8D86Dbca6e6d738b043c',
        value: '500000000000000',
      });

      console.log(tx)
    } catch (e) {
      console.error(e);
    }
  }, [connector]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
        </TouchableOpacity>
        
      )}
      <TouchableOpacity onPress={payDrink} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Pay</Text>
      </TouchableOpacity>
      {!!connector.connected && (
        <>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
          
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
