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
  Linking,
} from "react-native";
import DateTime from "@react-native-community/datetimepicker";
import MapView from "react-native-maps";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import CardLayanan from "../../component/CardLayanan";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { getTransaksi, uploadBukti, verifikasi } from "../../utils/redux/actions";
import { base_url, toFormData } from "../../utils/helper";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

function Detail(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLihat, setModalLihat] = useState(false)
  const [data, setData] = useState({
    tanggal: new Date(),
    jam: "",
    _tanggal: "",
  });

  const user = useSelector(state => state.mainReducer.user)
  const profile = useSelector(state => state.mainReducer.profile)
  const dispatch = useDispatch()
  const { id } = props.route.params
  const [isTanggal, setTgl] = useState(false);
  const [isJam, setJm] = useState(false);
  const [location, setLocation] = useState(null);
  const [current, setCurrent] = useState({})
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState({
    file: "",
    metode_pembayaran: ""
  })
  const handleDateChange = (event, date) => {
    // setData({ date: date })

    const current = date || data.tanggal;
    setData({
      ...data,
      tanggal: current,
      _tanggal: new Date(current).toDateString(),
    });
    setTgl(false);
  };

  const handleJam = (event, date) => {
    const current = date || data.tanggal;
    const newDate = new Date(current);
    setData({ ...data, jam: newDate.getHours() + ":" + newDate.getMinutes() });
    setJm(false);
  };

  useEffect(() => {
    setLoading(true)
    dispatch(getTransaksi(id))
      .then(res => {
        setCurrent(res.data)
        setLoading(false)
        // alert(JSON.stringify(res))
      })
      .catch(err => {
        setLoading(false)
      })
    handleLokasi()
  }, []);

  const handleLokasi = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      Alert.alert("Permission to access location was denied");
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    setLoading(false);

    setLocation(location);
  };

  const handleUpload = () => {
    const temp = {
      barber_id: current?.barber?.id,
      metode_id: form.metode_pembayaran,
      pengguna_id: profile?.id,
      transaksi_id: current.id,
      dokumen: {
        ...form.file,
        type: form.file.mimeType
      }
    }

    dispatch(uploadBukti(toFormData(temp)))
      .then(res => {
        dispatch(getTransaksi(id))
          .then(res => {
            setCurrent(res.data)
            setLoading(false)
            // alert(JSON.stringify(res))
          })
          .catch(err => {
            setLoading(false)
          })
      })
  }

  const handleVerifikasi = (status) => {
    dispatch(verifikasi(current?.id, toFormData({ status: status })))
      .then(res => {
        dispatch(getTransaksi(id))
          .then(res => {
            setCurrent(res.data)
            setLoading(false)
            alert("Berhasil Memverifikasi Transaksi")
            // alert(JSON.stringify(res))
          })
          .catch(err => {
            setLoading(false)
            alert(JSON.stringify(err))
          })
      })
  }

  const handleSelect = (id) => {
    setForm(e => ({ ...form, metode_pembayaran: id }));
  }

  const handleDokumen = async () => {
    
  }

  const getStatus = (status) => {
    switch (status) {
      case 0: return 'Belum Dibayar';
      case 1: return 'Konfirmasi Pembayaran';
      case 2: return 'Telah Dibayar';
      case 3: return 'Diproses';
      case 4: return 'Selesai';
      case 5: return 'Dibatalkan';
    }
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
                minHeight: 60,
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
                  justifyContent: "space-between",
                },
              ]}
            >
              <Pressable onPress={() => props.navigation.navigate("Barber")}>
                <Ionicons name="arrow-back" size={30} color="white" />
              </Pressable>
              <Text style={[styles.heading, { color: "white" }]}>POGARO</Text>
            </View>
          </View>
          <View
            style={[
              {
                backgroundColor: "green",
                width: "100%",
                paddingVertical: 20,
              },
            ]}
          >
            <View style={styles.container}>
              <Text style={[styles.heading, { marginTop: 10, color: "white" }]}>
                Detail Booking
              </Text>
            </View>
          </View>
          <View style={[styles.container, { marginBottom: 100 }]}>
            <View
              style={[
                styles.colCenter,
                {
                  justifyContent: "flex-start",
                  width: "100%",
                  marginVertical: 15,
                },
              ]}
            >
              <Text>Layanan yang dipesan : </Text>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {current?.servis?.nama_servis}
              </Text>
              <Text>Nama Pemesan : </Text>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {current?.pengguna?.nama} 
              </Text>
              <Text>Tanggal Booking : {current.tanggal}</Text>
              <Text>Jam Booking : {current.waktu}</Text>
              <Text>Status : {getStatus(parseInt(current.status))}</Text>
            </View>
            <View
              style={[
                styles.rowCenter,
                {
                  width: "100%",
                  justifyContent: "flex-start",
                  marginBottom: 10,
                },
              ]}
            >
              <Ionicons name="location-outline" size={18} color="black" />
              <Text>Lokasi</Text>
            </View>
            {!isLoading && (
              <MapView
                style={{ width: "100%", height: 300 }}
                initialRegion={{
                  latitude: parseFloat(current?.latitude),
                  longitude: parseFloat(current?.longitude),
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}

              >
                <MapView.Marker
                  coordinate={{
                    latitude: parseFloat(current?.latitude),
                    longitude: parseFloat(current?.longitude),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  title={"Lokasi Transaksi"}
                />
              </MapView>
            )}

            <View
              style={[
                styles.rowCenter,
                {
                  width: "100%",
                  justifyContent: "flex-start",
                  marginVertical: 10,
                },
              ]}
            >
              <Ionicons name="location-outline" size={18} color="black" />
              <Text>Detail Alamat : </Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: "#c7c7c7",
                borderRadius: 10,
              }}
            >
              <Text>{current.detail_alamat}</Text>
            </View>
            <View
              style={{
                marginVertical: 5,
                padding: 10,
                backgroundColor: "#bdd7ff",
                borderRadius: 10,
              }}
            >
              <View
                style={[
                  styles.rowCenter,
                  {
                    width: "100%",
                    justifyContent: "flex-start",
                    marginVertical: 5,
                  },
                ]}
              >
                <MaterialIcons name="payment" size={18} color="black" />
                <Text>Detail Pembayaran : </Text>
              </View>
              <View
                style={[
                  styles.colCenter,
                  {
                    justifyContent: "flex-start",
                    width: "100%",
                    marginVertical: 15,
                  },
                ]}
              >
                <Text>Layanan yang dipesan : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {current?.servis?.nama_servis}
                </Text>
                <Text>Harga Jasa : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Rp. {current?.servis?.harga_servis}
                </Text>
                <Text>Ongkos Transportasi Rp. 2000 /km : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Rp. {current.ongkir}
                </Text>
                <Text>Total Bayar : </Text>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Rp. {parseInt(current?.servis?.harga_servis) + parseInt(current.ongkir)}
                </Text>
                {current.status !== "5" ? !current?.bukti_pembayaran ? (
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose,
                      ,
                      { marginTop: 15, width: "100%", backgroundColor: "grey" },
                    ]}
                  >
                    <Text style={styles.textStyle} onPress={() => setModalVisible(true)}>Upload Bukti Pembayaran</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose,
                      ,
                      { marginTop: 15, width: "100%", backgroundColor: "grey" },
                    ]}
                  >
                    <Text style={styles.textStyle} onPress={() => setModalLihat(true)}>Lihat Bukti Pembayaran</Text>
                  </Pressable>
                ) : null}

              </View>
            </View>
            {
              current.status !== "5" ? (
                <React.Fragment>
                  <Pressable
                    style={[styles.button, styles.buttonPrimary, { marginTop: 15 }]}
                    onPress={() => Linking.openURL("https://wa.me/" + current?.pengguna?.no_hp)}
                  >
                    <Text style={styles.textStyle}>Hubungi Pemesan</Text>
                  </Pressable>
                  {
                    !["3", "4"].includes(current.status) && (
                      <Pressable
                        onPress={() => handleVerifikasi(3)}
                        style={[styles.button, styles.buttonDanger, { marginTop: 15, backgroundColor: "green" }]}
                      >
                        <Text style={styles.textStyle}>Konfrimasi & Proses</Text>
                      </Pressable>
                    )
                  }

                </React.Fragment>
              ) : null
            }

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
                    },
                    styles.shadow
                  ]}
                >
                  <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }} >Pilih Dokumen</Text>
                  <AntDesign name="pluscircle" size={18} color="white" />
                </TouchableOpacity>
                {
                  current.metode_pembayaran?.map(e => (
                    <TouchableOpacity
                      onPress={() => handleSelect(e.id)}
                      style={[
                        {
                          width: "100%",
                          borderRadius: 20,
                          height: 100,
                          backgroundColor: form.metode_pembayaran === e.id ? "#c4c4c4" : "white",
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
                              {e.nama_metode}
                            </Text>
                            <Text style={[styles.heading, { fontSize: 14 }]}>
                              Tujuan : {e.nomor_tujuan}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity >
                  ))
                }
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalLihat}
            onRequestClose={() => {
              setModalLihat(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={[styles.heading, { fontSize: 16 }]}>Lihat Bukti Pembayaran</Text>
                <Image
                  style={{ width: 250, height: 250, borderRadius: 10, aspectRatio: 0.8 }}
                  source={{
                    uri:
                      base_url + "/bukti/" + current?.bukti_pembayaran?.dokumen,
                  }}
                />

                <TouchableOpacity
                  onPress={() => setModalLihat(false)}
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
    backgroundColor: "#03fc73",
  },
  buttonDanger: {
    backgroundColor: "#fc034e",
  },
  buttonPrimary: {
    backgroundColor: "#5280ff",
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
});

export default Detail;
