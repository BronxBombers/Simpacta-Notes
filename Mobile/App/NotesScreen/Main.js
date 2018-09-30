import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Amplify, {API, Auth, Storage} from 'aws-amplify';
import { Cache } from 'aws-amplify';

const iconWidth = (width * 52) / 100;
const iconImage = require('../assets/srmlogo.png');

export default class NotesScreen extends Component {

  constructor() {
    super();

    this.state = {
      notes: [],
      isLogin: false,
      canLogin: false
    };
  }

  documentUser = async() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        let sub = user.attributes.sub;
        Storage.get(sub + ".txt", {download: true})
          .then(userIsEntered =>{
            console.log("user already entered!")
            console.log(userIsEntered);
          })
          .catch(userIsNotEntered => {
            console.log(userIsNotEntered);
            Auth.currentCredentials()
              .then(credentials => {
                let fedID = credentials.identityId;
                let userDoc = {id: fedID}
                Storage.put(sub + ".txt", JSON.stringify(userDoc))
                  .then(accepted => console.log("succesfully documented user"))
                  .catch(notAccepted => {
                    console.log("error documenting the user");
                    console.log(notAccepted);
                  });
              })
              .catch(err => {
                console.log(err);
                console.log("error getting user credentials");
              })
          });
      })
      .catch(err => {
        console.log(err);
        console.log("error getting user info");
        return false;
      })
  }

  moveToLogSignScreen = () => {
    Actions.pop();
  };

  list = async () => {
    Storage.list("", {level: "private"})
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      })
    // Storage.list("/", {level: "private"})
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })
  }

  uploadNote = async () => {
    Auth.currentCredentials().then(user => console.log(user));
    Auth.currentAuthenticatedUser().then(user => console.log(user));
    var debug = {noteText: 'test', priority: 4, image: "imageurl"};
    var blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
    Storage.put('test321.json', blob, {level:'private'})
    .then (result => console.log(result))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <View style={{
        backgroundColor: appMainColor, flex: 1, alignItems: 'center', justifyContent: 'center',
      }}
      >
        <Image
          source={iconImage}
          resizeMode="cover"
          style={{
            width: iconWidth,
            tintColor: mainThemeColor,
            marginTop: -height / 30,
            height: iconWidth * 0.86,
          }}
        />
        <Button
          onPress={this.list}
          style={{
            backgroundColor: mainThemeColor, alignSelf: 'center', marginTop: height / 50, height: height / 14,
          }}
        >
          <Text
            uppercase={false}
            style={{ color: appMainColor, fontWeight: '600', fontSize: GLOBAL.totalSize(2.35) }}
          >{language.logOut}
          </Text>
        </Button>
      </View>
    );
  }
}