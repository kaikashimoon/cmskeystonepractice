const { Text, Password, Relationship, Checkbox } = require('@keystonejs/fields')

module.exports = {
    fields: {
        firstName: {
            type: Text,
            isRequired: true
        },
        lastName: {
            type: Text,
            isRequired: true
        },
        userName: {
            type: Text,
            isRequired: true
        },
        password: {
            type: Password,
            isRequired: true
        },
        books: {
            type: Relationship,
            ref: 'Book.readers',
            many: true
        }
    },
    labelField: 'userName'
}