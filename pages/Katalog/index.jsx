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
import { deleteServis, getBarber, getKatalogId, getServisId, me, tambahKatalog, tambahServis } from "../../utils/redux/actions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { base_url, toFormData } from "../../utils/helper";
import { FormInput } from "../../component";
import * as DocumentPicker from 'expo-document-picker';
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

function Katalog({ navigation }) {
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
    dokumen: "",
    nama_katalog: ""
  })

  useEffect(() => {
    dispatch(getKatalogId(profile.id)).then((res) => {
      setData(res.data.data);
    });
  }, []);


  const handleUpload = () => {
    const temp = {
      barber_id: profile.id,
      nama_foto: form.nama_katalog,
      dokumen: {
        ...form.file,
        type: form.file.mimeType
      }
    }

    dispatch(tambahKatalog(toFormData(temp)))
      .then((res) => {
        dispatch(getKatalogId(profile.id)).then((res) => {
          setData(res.data.data);
        });
        alert("berhasil")
        setModalVisible(false)
      })
      .catch((err) => {
        alert(JSON.stringify(err))
        setModalVisible(false)
      })
  }





  const handleTambahServis = () => {
    const data = {
      barber_id: profile.id,
      harga_servis: form.harga_servis,
      nama_servis: form.nama_servis
    }

    dispatch(tambahServis(toFormData(data)))
      .then((res) => {
        dispatch(getKatalogId(profile.id)).then((res) => {
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

  
  const handleDokumen = async () => {
    const doc = await DocumentPicker.getDocumentAsync();
    alert(JSON.stringify(doc))
    setForm(e => ({ ...form, file: doc }));
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
                backgroundColor: "green",
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
              <Text style={[styles.heading, { color: "white" }]}>Katalog</Text>
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
              <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }} >Tambah Katalog</Text>
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
                        <Image
                            style={{ width: 70, height: 70, borderRadius: 10 }}
                            source={{
                              uri:
                                base_url + "/katalog/" + e.file_katalog,
                            }}
                          />
                      </View>
                      <View
                        style={[
                          styles.colCenter,
                          { marginLeft: 10, maxWidth: "60%" },
                        ]}
                      >
                        <Text style={[styles.heading, { fontSize: 18 }]}>
                          {e.nama_foto}
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
                <Text style={[styles.heading, { fontSize: 16 }]}>Upload Bukti Pembayaran</Text>
                <View style={{ width: "100%", borderBottomWidth: 2, borderColor: "black", marginTop: 4 }} />
                <Text style={[styles.heading, { fontSize: 12 }]}>{form.file?.name}</Text>
                <TouchableOpacity
                  onPress={handleDokumen}
                  style={[
                    styles.rowCenter,
                    {
                      height: 40,
                      width: "100%",
                      backgroundColor: "green",
                      borderRadius: 10,
                      marginTop: 10,
                      marginBottom: 10
                    },
                    styles.shadow
                  ]}
                >
                  <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }} >Pilih Dokumen</Text>
                  <AntDesign name="pluscircle" size={18} color="white" />
                </TouchableOpacity>
                <TextInput style={styles.input} value={form.nama_katalog} onChangeText={e => setForm({...form, nama_katalog: e})} placeholder="Nama Katalog" />
                <TouchableOpacity
                  onPress={handleUpload}
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
                  <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }} >Upload</Text>
                  <AntDesign name="pluscircle" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[
                    styles.rowCenter,
                    {
                      height: 40,
                      width: "100%",
                      backgroundColor: "red",
                      borderRadius: 10,
                      marginTop: 10,
                    },
                    styles.shadow
                  ]}
                >
                  <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }} >Batal</Text>
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

export default Katalog;
