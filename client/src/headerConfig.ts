const dev = {
    crdentials: "include",
    mode: "cors"
}

const prod = {}

export default process.env.NODE_ENV === 'prod' ? prod : dev;