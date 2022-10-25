export const toFormData = (data) => {
  let fd = new FormData();
  Object.keys(data).map((e) => {
    fd.append(e, data[e]);
  });

  return fd;
};

export const base_url = "http://192.168.2.148:8000"


export const getStatus = (status) => {
  switch (status) {
    case 0: return 'Belum Dibayar';
    case 1: return 'Konfirmasi Pembayaran';
    case 2: return 'Telah Dibayar';
    case 3: return 'Diproses';
    case 4: return 'Selesai';
    case 5: return 'Dibatalkan'
  }
}

export const getStatusColor = (status) => {
  switch (status) {
    case 0: return '#cfcfcf';
    case 1: return '#a6fff5';
    case 2: return '#68fc5d';
    case 3: return '#c2cc58';
    case 4: return '#5b5efc';
    case 5: return '#ff2b2b';
  }
}