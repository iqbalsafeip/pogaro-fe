import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  StatusBar,
  ImageBackground,
} from "react-native";
import DateTime from "@react-native-community/datetimepicker";
import MapView from "react-native-maps";
import { Ionicons, AntDesign, Fontisto, MaterialIcons, EvilIcons } from "@expo/vector-icons";
import CardLayanan from "../../component/CardLayanan";
import * as Location from "expo-location";
import { Link } from "@react-navigation/native";
import { deleteServis, getBarber, getServisId, me, tambahServis } from "../../utils/redux/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { base_url, toFormData } from "../../utils/helper";
import { FormInput } from "../../component";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

function Servis({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.mainReducer.user);
  const profile = useSelector((state) => state.mainReducer.profile);
  const [isTanggal, setTgl] = useState(false);
  const [isJam, setJm] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    harga_servis: "",
    nama_servis: ""
  })
 
  useEffect(() => {
    dispatch(getServisId(profile.id)).then((res) => {
      setData(res.data.data);
    });
  }, []);


  

  

  const handleTambahServis = () => {
    const data = {
      barber_id: profile.id,
      harga_servis: form.harga_servis,
      nama_servis: form.nama_servis
    }

    dispatch(tambahServis(toFormData(data)))
      .then((res) => {
        dispatch(getServisId(profile.id)).then((res) => {
          setData(res.data.data);
        });
        setModalVisible(false)
      })
      .catch((err) => {
        setModalVisible(false)
      })
  }

  const handleDelete = (id) => {
    dispatch(deleteServis(id))
      .then((res) => {
        dispatch(getServisId(profile.id)).then((res) => {
          setData(res.data.data);
        });
        alert("Berhasil Menghapus Servis")
        setModalVisible(false)
      })
      .catch((err) => {
        setModalVisible(false)
      })
  }

  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <ScrollView
          style={{
            backgroundColor: "white",
            width: width,
            minHeight: height,
          }}
        >
          <View
            style={[
              {
                width: "100%",
                minHeight: 100,
                backgroundColor: "#C7F2A4",
                borderBottomStartRadius: 15,
                borderBottomEndRadius: 15,
              },
              styles.colCenter,
            ]}
          >
            <View
              style={[
                styles.container,
                {
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 20,
                  justifyContent: "space-between",
                },
              ]}
            >
              <Pressable onPress={() => navigation.navigate("Dashboard")}>
                <Ionicons name="arrow-back" size={30} color="white" />
              </Pressable>
              <Text style={[styles.heading, { color: "white" }]}>Servis</Text>
            </View>
          </View>

          <View
            style={[styles.container, { paddingBottom: 10, marginBottom: 20 }]}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={[
                styles.rowCenter,
                {
                  height: 40,
                  width: "100%",
                  backgroundColor: "blue",
                  borderRadius: 10,
                  marginTop: 10,
                },
                styles.shadow
              ]}
            >
              <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }} >Tambah Servis</Text>
              <AntDesign name="pluscircle" size={18} color="white" />
            </TouchableOpacity>
            {data.length > 0
              ? data.map((e, i) => (
                <View
                  style={[
                    {
                      width: "100%",
                      borderRadius: 20,
                      height: 100,
                      backgroundColor: "white",
                      marginTop: 15,
                    },
                    styles.shadow,
                  ]}
                >
                  <View
                    style={[
                      {
                        height: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 15,
                      },
                    ]}
                  >
                    <View
                      style={{
                        height: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 70,
                          width: 70,
                          backgroundColor: "#6fffa9",
                          justifyContent: "center",
                          borderRadius: 10,
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons name="home-repair-service" size={32} color="white" />
                      </View>
                      <View
                        style={[
                          styles.colCenter,
                          { marginLeft: 10, maxWidth: "60%" },
                        ]}
                      >
                        <Text style={[styles.heading, { fontSize: 18 }]}>
                          {e.nama_servis}
                        </Text>
                        <Text style={[styles.heading, { fontSize: 14 }]}>
                          Rp. {e.harga_servis}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleDelete(e.id)
                      }
                      style={[
                        styles.rowCenter,
                        {
                          height: 70,
                          width: 70,
                          backgroundColor: "red",
                          borderRadius: 10,
                        },
                      ]}
                    >
                      <EvilIcons name="trash" size={28} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
              : null}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.heading}>Detail Booking</Text>
                <TextInput style={styles.input} value={form.nama_servis} onChangeText={e => setForm({...form, nama_servis: e})} placeholder="Nama Servis" />
                <TextInput style={styles.input} value={form.harga_servis} onChangeText={e => setForm({...form, harga_servis: e})} placeholder="Harga Servis" />
                <TouchableOpacity
                  onPress={handleTambahServis}
                  style={[
                    styles.rowCenter,
                    {
                      height: 40,
                      width: "100%",
                      backgroundColor: "green",
                      borderRadius: 10,
                      marginTop: 10,
                    },
                    styles.shadow
                  ]}
                >
                  <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }} >Tambah Servis</Text>
                  <AntDesign name="pluscircle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { width: "90%", alignSelf: "center" },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  colCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: { marginVertical: 4, backgroundColor: "white", width: "100%", borderRadius: 5, borderWidth: 2, borderColor: "gray", paddingHorizontal: 8 }
});

export default Servis;
