import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'B2B Marketplace API',
    version: '1.0.0',
    description:
      'REST API for the B2B Marketplace MVP. Supports Buyer, Seller and Admin flows for authentication, products, categories, RFQs and basic dashboards.',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'User ID' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['buyer', 'seller', 'admin'] },
          companyName: { type: 'string', nullable: true },
          gstNumber: { type: 'string', nullable: true },
          address: { type: 'string', nullable: true },
          location: {
            type: 'object',
            properties: {
              city: { type: 'string', nullable: true },
              state: { type: 'string', nullable: true },
              country: { type: 'string', nullable: true },
            },
          },
          isActive: { type: 'boolean' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string', nullable: true },
          icon: { type: 'string', nullable: true },
          slug: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          shortDescription: { type: 'string', nullable: true },
          description: { type: 'string', nullable: true },
          category: { $ref: '#/components/schemas/Category' },
          seller: { $ref: '#/components/schemas/User' },
          priceMin: { type: 'number' },
          priceMax: { type: 'number' },
          moq: { type: 'number' },
          status: { type: 'string', enum: ['Draft', 'Pending', 'Live'] },
          tags: { type: 'array', items: { type: 'string' } },
          images: { type: 'array', items: { type: 'string' } },
          city: { type: 'string', nullable: true },
          state: { type: 'string', nullable: true },
        },
      },
      RFQ: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          product: { $ref: '#/components/schemas/Product' },
          buyer: { $ref: '#/components/schemas/User' },
          seller: { $ref: '#/components/schemas/User' },
          quantity: { type: 'number' },
          deliveryLocation: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              state: { type: 'string' },
              country: { type: 'string' },
            },
          },
          status: {
            type: 'string',
            enum: ['Pending Response', 'Quoted', 'Accepted', 'Declined'],
          },
          expiresAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      RFQResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          rfq: { $ref: '#/components/schemas/RFQ' },
          seller: { $ref: '#/components/schemas/User' },
          finalPrice: { type: 'number' },
          terms: { type: 'string', nullable: true },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          buyer: { $ref: '#/components/schemas/User' },
          seller: { $ref: '#/components/schemas/User' },
          totalAmount: { type: 'number' },
          status: {
            type: 'string',
            enum: ['Pending', 'Confirmed', 'Shipped', 'Completed', 'Cancelled'],
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      KPIBuyerSummary: {
        type: 'object',
        properties: {
          categoriesCount: { type: 'number' },
          productsCount: { type: 'number' },
          openRFQs: { type: 'number' },
        },
      },
      KPISellerSummary: {
        type: 'object',
        properties: {
          totalProducts: { type: 'number' },
          liveProducts: { type: 'number' },
          pendingApprovals: { type: 'number' },
          openRFQs: { type: 'number' },
          responsesThisWeek: { type: 'number' },
        },
      },
      KPIAdminSummary: {
        type: 'object',
        properties: {
          totalProducts: { type: 'number' },
          pendingProducts: { type: 'number' },
          totalRFQs: { type: 'number' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          code: { type: 'integer' },
          details: { type: 'object', nullable: true },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Buyer and Seller authentication' },
    { name: 'Products', description: 'Product catalogue and management' },
    { name: 'Categories', description: 'Product categories' },
    { name: 'RFQs', description: 'Request for Quote flows' },
    { name: 'Profile', description: 'User profile for buyer and seller' },
    { name: 'Dashboard', description: 'Dashboard KPI summaries' },
    { name: 'Admin', description: 'Admin management APIs' },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.js'],
}

export const swaggerSpec = swaggerJSDoc(options)


