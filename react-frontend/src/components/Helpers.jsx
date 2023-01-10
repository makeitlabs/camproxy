export const getLocalItem = (name, def) => {
    let val = localStorage.getItem(name);
    if (val === null || val === undefined)
        return def;
    else return val;
}

