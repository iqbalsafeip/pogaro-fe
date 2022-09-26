export const toFormData = (data) => {
  let fd = new FormData();
  Object.keys(data).map((e) => {
    fd.append(e, data[e]);
  });

  return fd;
};

export const base_url = "http://192.168.2.156:8000"