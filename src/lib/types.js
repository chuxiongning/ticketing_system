// Type definitions are handled via JSDoc comments in JavaScript

/**
 * @typedef {'new' | 'assigned' | 'inProgress' | 'done' | 'declined' | 'cancelled'} TicketStatus
 */

/**
 * @typedef {'low' | 'medium' | 'high' | 'urgent'} Priority
 */

/**
 * @typedef {'text' | 'number' | 'date' | 'location' | 'photo' | 'signature' | 'faceRecognition'} FieldType
 */

/**
 * @typedef {Object} TicketComment
 * @property {string} id
 * @property {string} userId
 * @property {string} userName
 * @property {string} comment
 * @property {Date} createdAt
 * @property {'general' | 'accept' | 'decline' | 'cancel'} type
 */

/**
 * @typedef {Object} TemplateField
 * @property {string} id
 * @property {string} name
 * @property {FieldType} type
 * @property {boolean} required
 */

/**
 * @typedef {Object} TemplateStep
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {TemplateField[]} fields
 * @property {number} order
 */

/**
 * @typedef {Object} Template
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {TemplateStep[]} steps
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Ticket
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} templateId
 * @property {string} templateName
 * @property {TicketStatus} status
 * @property {Priority} priority
 * @property {string} assignedTo
 * @property {string} assignedToName
 * @property {string} createdBy
 * @property {string} createdByName
 * @property {Date} createdAt
 * @property {Date} dueDate
 * @property {string[]} completedSteps
 * @property {Object<string, any>} stepData
 * @property {boolean} [accepted]
 * @property {Date} [acceptedAt]
 * @property {TicketComment[]} comments
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {'admin' | 'engineer' | 'manager'} role
 */

export {};
