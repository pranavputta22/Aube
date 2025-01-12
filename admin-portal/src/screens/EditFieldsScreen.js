import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon } from "react-native-elements";
import ProgressDialog from "../components/ProgressDialog";
import colors from "../util/colors";
import firebase from "firebase";
import DropDownPicker from "react-native-dropdown-picker";

const fieldTypes = [
  { label: "Text", value: "string" },
  { label: "Large Text", value: "string" },
  { label: "Auto", value: "auto" },
  { label: "Number", value: "number" },
  { label: "Location", value: "location" },
];

class EditFieldsScreen extends React.Component {
  state = {
    showProgress: false,
    formItems: [],
    enabled: true,
  };

  componentDidMount() {
    this.setState({ showProgress: true });
    firebase
      .functions()
      .httpsCallable("getFields")({
        collection: this.props.route.params.collection,
      })
      .then((response) => {
        this.setState({ formItems: response.data.data });
        this.setState({ showProgress: false });
      })
      .catch((response) => {
        this.setState({ showProgress: false });
        alert("Um" + response);
      });
  }

  /**
   * Validate that all fields are filled in
   *
   * @memberof EditFieldsScreen
   */
  validate = () => {
    for (var i = 0; i < this.state.formItems.length; i++) {
      if (
        this.state.formItems[i].name == "" ||
        this.state.formItems[i].fieldType == ""
      ) {
        return false;
      }
    }
    return true;
  };

  /**
   * manipulate form state and enter keys
   *
   * @memberof EditFieldsScreen
   */
  changeFormState = (key, value, id) => {
    var newArr = this.state.formItems.slice();
    newArr[id][key] = value;
    if (key == "name") {
      newArr[id]["key"] = value.toLowerCase().replace(" ", "_");
    }
    this.setState({ formItems: newArr });
  };

  /**
   * add field to the form
   *
   * @memberof EditFieldsScreen
   */
  addField = () => {
    const arr = this.state.formItems;
    let id = arr.length > 0 ? arr[arr.length - 1].id + 1 : 0;
    this.setState((state) => {
      const list = state.formItems.push({
        name: "",
        fieldType: "",
        key: "",
        id: id,
      });
      return { list, value: "" };
    });
  };

  /**
   * submit the form to firebase database
   *
   * @memberof EditFieldsScreen
   */
  submitForm = () => {
    this.setState({ enabled: false });
    if (this.state.formItems.length > 0 && this.validate()) {
      firebase
        .functions()
        .httpsCallable("updateFields")({
          collection: this.props.route.params.collection,
          data: this.state.formItems,
        })
        .then((response) => {
          alert("Success");
          this.setState({ enabled: true });
        })
        .catch((err) => {
          alert(JSON.stringify(err));
          this.setState({ enabled: true });
        });
    } else {
      this.setState({ enabled: true });
      alert("Please check you filled in all fields.");
    }
  };

  render() {
    this.props.navigation.setOptions({
      headerRight: () => {
        return this.state.enabled ? (
          <TouchableOpacity
            style={{ paddingHorizontal: 20 }}
            onPress={this.submitForm}
          >
            <Icon name="check" type="feather" color={colors.blue} />
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            style={{ paddingHorizontal: 20 }}
            size="small"
            color={colors.blue}
          />
        );
      },
      headerTitle: "Edit " + this.props.route.params.name + " Fields",
    });
    return (
      <View style={styles.container}>
        <ProgressDialog show={this.state.showProgress} />
        <View style={styles.form}>
          {this.state.formItems.map((item) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: "2%",
                  zIndex: 1000 - item.id,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                    borderWidth: 1,
                    borderColor: colors.grey,
                  }}
                  placeholder="Field Name"
                  value={item.name}
                  onChangeText={(text) =>
                    this.changeFormState("name", text, item.id)
                  }
                />
                <DropDownPicker
                  containerStyle={styles.picker}
                  items={fieldTypes}
                  defaultValue={item.fieldType}
                  placeholder="Type"
                  itemStyle={{ backgroundColor: "white" }}
                  dropDownStyle={{ backgroundColor: "white" }}
                  onChangeItem={(_, index) =>
                    this.changeFormState(
                      "fieldType",
                      fieldTypes[index].value,
                      item.id
                    )
                  }
                />
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          disabled={!this.state.enabled}
          style={styles.button}
          onPress={this.addField}
        >
          <Text style={styles.buttonText}>Add Field</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  picker: {
    width: "20%",
  },
  form: {
    margin: "5%",
    zIndex: 1000,
    paddingHorizontal: "2.5%",
    paddingBottom: "2.5%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  button: {
    alignSelf: "center",
    marginBottom: "5%",
    width: "90%",
    alignItems: "center",
    height: "7.5%",
    backgroundColor: colors.blue,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 22,
  },
});

export default EditFieldsScreen;
