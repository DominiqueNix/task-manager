module.exports = {
  counter: (index) => {
    return index + 1;
  },
  json: (content) => {
    return JSON.stringify(content);
  },
  toStringDate: (date) => {
    return new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },
  firstInital: (obj) => {
    return obj.email.charAt(0).toUpperCase();
  },
  stringCompare: (string1, string2, options) => {
    if (string1 == string2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  projectPermissions: (ownerId, userId, editPermissions, options) => {
    if (editPermissions && !ownerId.equals(userId)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  },
};
