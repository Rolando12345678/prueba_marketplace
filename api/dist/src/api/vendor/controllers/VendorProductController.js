"use strict";
/*
 * spurtcommerce API
 * version 4.8.4
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorProductController = void 0;
const tslib_1 = require("tslib");
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const ProductService_1 = require("../../core/services/ProductService");
const ProductToCategoryService_1 = require("../../core/services/ProductToCategoryService");
const ProductImageService_1 = require("../../core/services/ProductImageService");
const ProductDiscount_1 = require("../../core/models/ProductDiscount");
const ProductSpecial_1 = require("../../core/models/ProductSpecial");
const VendorProducts_1 = require("../../core/models/VendorProducts");
const VendorProductRequest_1 = require("./requests/VendorProductRequest");
const ProductToCategory_1 = require("../../core/models/ProductToCategory");
const ProductImage_1 = require("../../core/models/ProductImage");
const CategoryService_1 = require("../../core/services/CategoryService");
const VendorProductService_1 = require("../../core/services/VendorProductService");
const OrderProductService_1 = require("../../core/services/OrderProductService");
const ProductDiscountService_1 = require("../../core/services/ProductDiscountService");
const ProductSpecialService_1 = require("../../core/services/ProductSpecialService");
const VendorService_1 = require("../../core/services/VendorService");
const CustomerService_1 = require("../../core/services/CustomerService");
const moment = require("moment");
const class_transformer_1 = require("class-transformer");
const env_1 = require("../../../../src/env");
const S3Service_1 = require("../../../../src/api/core/services/S3Service");
const fs = require("fs");
const path = tslib_1.__importStar(require("path"));
const SkuModel_1 = require("../../core/models/SkuModel");
const SkuService_1 = require("../../core/services/SkuService");
const ProductTirePriceService_1 = require("../../core/services/ProductTirePriceService");
const ProductTirePrice_1 = require("../../core/models/ProductTirePrice");
const UpdateStockRequest_1 = require("./requests/UpdateStockRequest");
const ProductVideoService_1 = require("../../core/services/ProductVideoService");
const ProductVideo_1 = require("../../core/models/ProductVideo");
const ImageService_1 = require("../../core/services/ImageService");
const CategoryPathService_1 = require("../../core/services/CategoryPathService");
const VendorProductAdditionalFileService_1 = require("../../../../src/api/core/services/VendorProductAdditionalFileService");
const pluginLoader_1 = require("../../../loaders/pluginLoader");
const uncino_1 = tslib_1.__importDefault(require("uncino"));
const VendorProductAdditionalFileModel_1 = require("../../../../src/api/core/models/VendorProductAdditionalFileModel");
const product_1 = require("@spurtcommerce/product");
const typeorm_1 = require("typeorm");
const marketplace_1 = require("@spurtcommerce/marketplace");
const hooks = (0, uncino_1.default)();
let VendorProductController = class VendorProductController {
    constructor(productService, s3Service, productToCategoryService, productImageService, categoryService, vendorProductAdditionalFileService, productDiscountService, productSpecialService, orderProductService, customerService, vendorService, skuService, vendorProductService, productTirePriceService, productVideoService, categoryPathService, imageService) {
        this.productService = productService;
        this.s3Service = s3Service;
        this.productToCategoryService = productToCategoryService;
        this.productImageService = productImageService;
        this.categoryService = categoryService;
        this.vendorProductAdditionalFileService = vendorProductAdditionalFileService;
        this.productDiscountService = productDiscountService;
        this.productSpecialService = productSpecialService;
        this.orderProductService = orderProductService;
        this.customerService = customerService;
        this.vendorService = vendorService;
        this.skuService = skuService;
        this.vendorProductService = vendorProductService;
        this.productTirePriceService = productTirePriceService;
        this.productVideoService = productVideoService;
        this.categoryPathService = categoryPathService;
        this.imageService = imageService;
    }
    // Create Vendor Product API
    /**
     * @api {post} /api/vendor-product/create-vendor-product Create Vendor Product API
     * @apiGroup  Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} productName productName
     * @apiParam (Request body) {String} [productDescription] productDescription
     * @apiParam (Request body) {String} sku stock keeping unit
     * @apiParam (Request body) {String} [upc] upc
     * @apiParam (Request body) {String} [hsn] hsn
     * @apiParam (Request body) {String} image product Image
     * @apiParam (Request body) {String} [productSlug] productSlug
     * @apiParam (Request body) {Number} [packingCost] packingCost
     * @apiParam (Request body) {Number} [shippingCost] shippingCost
     * @apiParam (Request body) {Number} [tax] tax
     * @apiParam (Request body) {Number} [taxType] taxType
     * @apiParam (Request body) {Number} [others] others
     * @apiParam (Request body) {String} categoryId CategoryId
     * @apiParam (Request body) {String} [relatedProductId] relatedProductId
     * @apiParam (Request body) {String} categoryId CategoryId
     * @apiParam (Request body) {String} relatedProductId relatedProductId
     * @apiParam (Request body) {Number} quantity quantity
     * @apiParam (Request body) {Number} price price
     * @apiParam (Request body) {Number} [outOfStockStatus] outOfStockStatus
     * @apiParam (Request body) {Number} [requiredShipping] requiredShipping
     * @apiParam (Request body) {String} [dateAvailable] dateAvailable
     * @apiParam (Request body) {Number{..9999}} sortOrder sortOrder
     * @apiParam (Request body) {String} [productSpecial] productSpecial
     * @apiParam (Request body) {String} [tirePrices] tirePrices
     * @apiParam (Request body) {String} [productDiscount] productDiscount
     * @apiParam (Request body) {Object} [productVideo] video
     * @apiParam (Request body) {String} productVideo.name video name
     * @apiParam (Request body) {String} productVideo.path for embedded have to pass path only
     * @apiParam (Request body) {Number} productVideo.type 1 -> video 2 -> embedded
     * @apiParamExample {json} Input
     * {
     *      "productName" : "",
     *      "productDescription" : "",
     *      "sku" : "",
     *      "hsn" : "",
     *      "image" : "",
     *      "productSlug" : "",
     *      "categoryId" : [],
     *      "upc" : "",
     *      "quantity" : "",
     *      "price" : "",
     *      "packingCost" : "",
     *      "shippingCost" : "",
     *      "tax" : "",
     *      "others" : "",
     *      "productSlug" : "",
     *      "outOfStockStatus" : "",
     *      "requiredShipping" : "",
     *      "dateAvailable" : "",
     *      "sortOrder" : "",
     *      "image":[
     *      {
     *      "image":""
     *      "containerName":""
     *      "defaultImage":""
     *      }
     *      ]
     *      "tirePrices":[
     *      {
     *      "quantity":""
     *      "price":"",
     *      "skuName":""
     *      }
     *      ]
     *     "relatedProductId":[ ]
     *     "productSpecial":[
     *      {
     *     "customerGroupId":""
     *     "specialPriority":""
     *     "specialPrice":""
     *     "specialDateStart":""
     *     "specialDateEnd":""
     *      }]
     *     "productDiscount":[
     *      {
     *         "discountPriority":""
     *         "discountPrice":""
     *         "discountDateStart":""
     *         "discountDateEnd":""
     *      }],
     *      "productVideo":{
     *               "name": "",
     *               "path": "",
     *               "type": ""
     *      }
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully created new Vendor product.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/create-vendor-product
     * @apiErrorExample {json} Vendor Product error
     * HTTP/1.1 500 Internal Server Error
     */
    createProduct(product, req, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            product.status = 0;
            const productSave = yield (0, product_1.productCreate)(product, (0, typeorm_1.getConnection)());
            if (productSave.status === 1) {
                const vendorProducts = new VendorProducts_1.VendorProducts();
                vendorProducts.productId = productSave.data.productId;
                vendorProducts.vendorId = req.user.vendorId;
                vendorProducts.sku_id = productSave.data.skuId;
                vendorProducts.approvalFlag = 0;
                vendorProducts.approvedBy = 0;
                vendorProducts.approvedDate = undefined;
                yield this.vendorProductService.create(vendorProducts);
                const successResponse = {
                    status: 1,
                    message: 'Successfully created Vendor Product',
                    data: productSave.data,
                };
                return response.status(200).send(successResponse);
            }
            else {
                const errorResponse = {
                    status: 0,
                    message: productSave.message,
                };
                return response.status(400).send(errorResponse);
            }
        });
    }
    // Update Vendor Product API
    /**
     * @api {put} /api/vendor-product/update-vendor-product/:id Update Vendor Product API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} productName productName
     * @apiParam (Request body) {String} [productDescription] productDescription
     * @apiParam (Request body) {String} sku stock keeping unit
     * @apiParam (Request body) {String} [upc] upc
     * @apiParam (Request body) {String} [hsn] hsn
     * @apiParam (Request body) {String} image product Image
     * @apiParam (Request body) {String} [productSlug] productSlug
     * @apiParam (Request body) {Number} quantity quantity
     * @apiParam (Request body) {String} categoryId CategoryId
     * @apiParam (Request body) {String} [relatedProductId relatedProductId
     * @apiParam (Request body) {Number} quantity quantity
     * @apiParam (Request body) {Number} price price
     * @apiParam (Request body) {Number} [packingCost] packingCost
     * @apiParam (Request body) {Number} [shippingCost] shippingCost
     * @apiParam (Request body) {Number} [tax] tax
     * @apiParam (Request body) {Number} [taxType] taxType
     * @apiParam (Request body) {Number} [others] others
     * @apiParam (Request body) {Number} [outOfStockStatus] outOfStockStatus
     * @apiParam (Request body) {Number} [requiredShipping] requiredShipping
     * @apiParam (Request body) {String} [dateAvailable] dateAvailable
     * @apiParam (Request body) {Number{..9999}} [sortOrder] sortOrder
     * @apiParam (Request body) {String} [productSpecial] productSpecial
     * @apiParam (Request body) {String} [tirePrices] tirePrices
     * @apiParam (Request body) {String} [productDiscount] productDiscount
     * @apiParam (Request body) {Object} [productVideo] video
     * @apiParamExample {json} Input
     * {
     *      "productName" : "",
     *      "productDescription" : "",
     *      "sku" : "",
     *      "hsn" : "",
     *      "image" : "",
     *      "categoryId" : [],
     *      "upc" : "",
     *      "price" : "",
     *      "packingCost" : "",
     *      "shippingCost" : "",
     *      "tax" : "",
     *      "others" : "",
     *      "outOfStockStatus" : "",
     *      "requiredShipping" : "",
     *      "dateAvailable" : "",
     *      "outOfStockStatus" : "",
     *      "sortOrder" : "",
     *      "image":[
     *      {
     *      "image":""
     *      "containerName":""
     *      "defaultImage":""
     *      }
     *      ],
     *      "tirePrices":[
     *      {
     *      "quantity":""
     *      "price":"",
     *      "skuName":""
     *      }
     *      ],
     *       "relatedProductId":[ "", ""],
     *      "productSpecial":[
     *      {
     *     "customerGroupId":""
     *     "specialPriority":""
     *     "specialPrice":""
     *     "specialDateStart":""
     *     "specialDateEnd":""
     *      }],
     *       "productDiscount":[
     *      {
     *         "discountPriority":""
     *         "discountPrice":""
     *         "discountDateStart":""
     *         "discountDateEnd"""
     *      }],
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated vendor products.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/update-vendor-product/:id
     * @apiErrorExample {json} updateProduct error
     * HTTP/1.1 500 Internal Server Error
     */
    updateProduct(id, product, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const category = product.categoryId;
            if (category.length === 0) {
                return response.status(400).send({
                    status: 0,
                    message: 'Category should not be empty',
                });
            }
            let validatedDiscount = false;
            let validatedSpecial = false;
            const validateDiscountPrice = product.productDiscount;
            if (validateDiscountPrice.length > 0) {
                validatedDiscount = validateDiscountPrice.some(discData => discData.discountPrice < 0);
            }
            const validateSpecialPrice = product.productSpecial;
            if (validateSpecialPrice.length > 0) {
                validatedSpecial = validateSpecialPrice.some(specialData => specialData.specialPrice < 0);
            }
            if (validatedDiscount || validatedSpecial || (product.price < 0)) {
                const errorResponse = {
                    status: 0,
                    message: 'Price should not be in negative',
                };
                return response.status(400).send(errorResponse);
            }
            if ((product.tax < 0)) {
                const errorResponse = {
                    status: 0,
                    message: 'tax should not be in negative',
                };
                return response.status(400).send(errorResponse);
            }
            const updateProduct = yield this.productService.findOne({
                where: {
                    productId: id,
                },
            });
            if (!updateProduct) {
                const errorResponse = {
                    status: 0,
                    message: 'Invalid productId',
                };
                return response.status(400).send(errorResponse);
            }
            const metaTagTitle = product.productSlug ? product.productSlug : product.productName;
            const slug = metaTagTitle.trim();
            const data = slug.replace(/\s+/g, '-').replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, '').toLowerCase();
            updateProduct.productSlug = yield this.validate_slug(data, id);
            updateProduct.name = product.productName;
            updateProduct.description = product.productDescription ? yield this.imageService.escapeChar(product.productDescription) : '';
            updateProduct.sku = product.sku;
            updateProduct.upc = product.upc;
            updateProduct.hsn = product.hsn;
            updateProduct.quantity = product.quantity ? product.quantity : 1;
            updateProduct.width = product.width;
            updateProduct.length = product.length;
            updateProduct.weight = product.weight;
            updateProduct.height = product.height;
            const serviceCharge = {};
            serviceCharge.productCost = product.price;
            serviceCharge.packingCost = product.packingCost ? product.packingCost : 0;
            serviceCharge.shippingCost = product.shippingCost ? product.shippingCost : 0;
            // saving sku //
            let saveSku;
            const findSku = yield this.skuService.findOne({ where: { skuName: updateProduct.sku } });
            if (findSku) {
                const finddSku = yield this.productService.findSkuName(updateProduct.productId, product.sku, 0);
                if (finddSku) {
                    const errorResponse = {
                        status: 0,
                        message: 'duplicate sku name, give some other name',
                    };
                    return response.status(400).send(errorResponse);
                }
                else {
                    findSku.skuName = updateProduct.sku;
                    findSku.price = product.price;
                    findSku.quantity = product.quantity;
                    findSku.isActive = 1;
                    saveSku = yield this.skuService.create(findSku);
                }
            }
            else {
                const newSku = new SkuModel_1.Sku();
                newSku.skuName = product.sku;
                newSku.price = product.price;
                newSku.quantity = product.quantity;
                newSku.isActive = 1;
                saveSku = yield this.skuService.create(newSku);
            }
            // ending sku //
            updateProduct.skuId = saveSku.id;
            serviceCharge.tax = 0;
            serviceCharge.others = product.others ? product.others : 0;
            updateProduct.serviceCharges = JSON.stringify(serviceCharge);
            updateProduct.price = serviceCharge.productCost + serviceCharge.packingCost + serviceCharge.shippingCost + serviceCharge.others;
            updateProduct.stockStatusId = product.outOfStockStatus;
            updateProduct.shipping = product.requiredShipping;
            updateProduct.dateAvailable = moment(product.dateAvailable).toISOString();
            updateProduct.taxType = product.taxType ? product.taxType : 0;
            updateProduct.taxValue = product.tax ? product.tax : 0;
            updateProduct.hasTirePrice = product.hasTirePrice ? product.hasTirePrice : 0;
            updateProduct.sortOrder = product.sortOrder;
            // adding category name and product name in keyword field for keyword search
            const rows = [];
            if (category.length !== 0) {
                for (const categoryId of category) {
                    const categoryNames = yield this.categoryService.findOne({
                        where: {
                            categoryId,
                        },
                    });
                    const name = '~' + categoryNames.name + '~';
                    rows.push(name);
                }
                rows.push('~' + product.productName + '~');
            }
            const values = rows.toString();
            updateProduct.keywords = values;
            updateProduct.modifiedBy = request.user.vendorId;
            const saveProduct = yield this.productService.create(updateProduct);
            // delete previous category
            this.productToCategoryService.delete({ productId: saveProduct.productId });
            // save category
            if (category.length !== 0) {
                for (const categoryId of category) {
                    const newProductToCategory = new ProductToCategory_1.ProductToCategory();
                    newProductToCategory.productId = saveProduct.productId;
                    newProductToCategory.categoryId = categoryId;
                    newProductToCategory.isActive = 1;
                    this.productToCategoryService.create(newProductToCategory);
                }
            }
            // Delete previous images
            this.productImageService.delete({ productId: saveProduct.productId });
            // Save products Image
            if (product.image) {
                const productImage = product.image;
                for (const imageRow of productImage) {
                    const imageData = JSON.stringify(imageRow);
                    const imageResult = JSON.parse(imageData);
                    const newProductImage = new ProductImage_1.ProductImage();
                    newProductImage.productId = saveProduct.productId;
                    newProductImage.image = imageResult.image;
                    newProductImage.containerName = imageResult.containerName;
                    newProductImage.defaultImage = imageResult.defaultImage;
                    this.productImageService.create(newProductImage);
                }
            }
            saveProduct.isSimplified = 1;
            yield this.productService.create(saveProduct);
            // Product Discount
            if (product.productDiscount) {
                // Delete the product discount
                this.productDiscountService.delete({ productId: saveProduct.productId });
                const productDiscount = product.productDiscount;
                const distArr = [];
                for (const discount of productDiscount) {
                    const discountData = new ProductDiscount_1.ProductDiscount();
                    discountData.productId = saveProduct.productId;
                    if (saveProduct.price <= discount.discountPrice) {
                        const errorResponse = {
                            status: 0,
                            message: 'discount price should be less than original price.',
                        };
                        return response.status(400).send(errorResponse);
                    }
                    discountData.quantity = 1;
                    const skuValue = yield this.skuService.findOne({
                        where: {
                            skuName: discount.skuName,
                        },
                    });
                    if (skuValue) {
                        discountData.skuId = skuValue.id;
                    }
                    else {
                        const errorResponse = {
                            status: 0,
                            message: 'sku does not exist in discount price',
                        };
                        return response.status(400).send(errorResponse);
                    }
                    discountData.priority = discount.discountPriority;
                    discountData.price = discount.discountPrice;
                    discountData.dateStart = moment(discount.discountDateStart).toISOString();
                    discountData.dateEnd = moment(discount.discountDateEnd).toISOString();
                    distArr.push(discountData);
                }
                yield this.productDiscountService.create(distArr);
            }
            // Product Special
            if (product.productSpecial) {
                this.productSpecialService.delete({ productId: saveProduct.productId });
                const productSpecial = product.productSpecial;
                const splArr = [];
                for (const special of productSpecial) {
                    const specialPriceData = new ProductSpecial_1.ProductSpecial();
                    specialPriceData.productId = saveProduct.productId;
                    if (saveProduct.price < special.specialPrice) {
                        const errorResponse = {
                            status: 0,
                            message: 'special price should be less than original price.',
                        };
                        return response.status(400).send(errorResponse);
                    }
                    specialPriceData.customerGroupId = special.customerGroupId;
                    specialPriceData.priority = special.specialPriority;
                    const specialSkuValue = yield this.skuService.findOne({
                        where: {
                            skuName: special.skuName,
                        },
                    });
                    if (specialSkuValue) {
                        specialPriceData.skuId = specialSkuValue.id;
                    }
                    else {
                        const errorResponse = {
                            status: 0,
                            message: 'sku does not exist in special price',
                        };
                        return response.status(400).send(errorResponse);
                    }
                    specialPriceData.price = special.specialPrice;
                    specialPriceData.dateStart = moment(special.specialDateStart).toISOString();
                    specialPriceData.dateEnd = moment(special.specialDateEnd).toISOString();
                    splArr.push(specialPriceData);
                }
                yield this.productSpecialService.create(splArr);
            }
            // Product tire price
            if (product.tirePrices) {
                yield this.productTirePriceService.delete({ productId: saveProduct.productId });
                const tirePrice = product.tirePrices;
                const tireArr = [];
                for (const tire of tirePrice) {
                    const productTirePrice = new ProductTirePrice_1.ProductTirePrice();
                    productTirePrice.productId = saveProduct.productId;
                    const tireSkuValue = yield this.skuService.findOne({
                        where: {
                            skuName: tire.skuName,
                        },
                    });
                    if (tireSkuValue) {
                        productTirePrice.skuId = tireSkuValue.id;
                    }
                    else {
                        const errorResponse = {
                            status: 0,
                            message: 'sku does not exist tire price',
                        };
                        return response.status(400).send(errorResponse);
                    }
                    productTirePrice.quantity = tire.quantity;
                    productTirePrice.price = tire.price;
                    tireArr.push(productTirePrice);
                }
                yield this.productTirePriceService.create(tireArr);
            }
            // update additional file
            const additionalData = yield this.vendorProductAdditionalFileService.findOne({
                where: {
                    productId: saveProduct.productId,
                },
            });
            if (additionalData) {
                additionalData.productId = saveProduct.productId;
                additionalData.fileName = product.fileName;
                additionalData.containerName = product.containerName;
                yield this.vendorProductAdditionalFileService.create(additionalData);
            }
            else {
                const newAdditionalData = new VendorProductAdditionalFileModel_1.VendorProductAdditionalFile();
                newAdditionalData.productId = saveProduct.productId;
                newAdditionalData.fileName = product.fileName;
                newAdditionalData.containerName = product.containerName;
                yield this.vendorProductAdditionalFileService.create(newAdditionalData);
            }
            // update product Video
            const video = product.productVideo;
            if (video) {
                yield this.productVideoService.delete({ productId: saveProduct.productId });
                const newProductVideo = new ProductVideo_1.ProductVideo();
                newProductVideo.productId = saveProduct.productId;
                newProductVideo.name = video.name;
                newProductVideo.type = video.type;
                newProductVideo.path = video.path;
                yield this.productVideoService.create(newProductVideo);
            }
            const vendorProduct = yield this.vendorProductService.findOne({
                where: {
                    productId: id,
                },
            });
            vendorProduct.sku_id = saveSku.id;
            yield this.vendorProductService.create(vendorProduct);
            if (saveProduct) {
                const successResponse = {
                    status: 1,
                    message: 'Successfully updated your product',
                };
                return response.status(200).send(successResponse);
            }
            else {
                const errorResponse = {
                    status: 0,
                    message: 'unable to updated your Product',
                };
                return response.status(400).send(errorResponse);
            }
        });
    }
    // Vendor Product List API
    /**
     * @api {get} /api/vendor-product/vendor-product-list Vendor Product List API
     * @apiGroup  Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {String} status 0->inactive 1-> active
     * @apiParam (Request body) {String} keyword keyword
     * @apiParam (Request body) {String} price price
     * @apiParam (Request body) {Number} count count
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get your product list",
     *      "data":{
     *      "vendorId" : "",
     *      "vendorName" : "",
     *      "productName" : "",
     *      "sku" : "",
     *      "model" : "",
     *      "price" : "",
     *      "quantity" : "",
     *      "status" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/vendor-product-list
     * @apiErrorExample {json} vendor error
     * HTTP/1.1 500 Internal Server Error
     */
    vendorProductList(limit, offset, status, keyword, price, productName, vendorName, count, sku, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const vendorProductDetails = yield (0, marketplace_1.vendorProductList)((0, typeorm_1.getConnection)(), limit, offset, keyword, sku, status, +price, productName, vendorName, count, request.user.vendorId);
            return response.status(200).send({
                status: vendorProductDetails.status,
                message: vendorProductDetails.message,
                data: vendorProductDetails.data,
            });
        });
    }
    // Delete Product API
    /**
     * @api {delete} /api/vendor-product/delete-product/:id Delete Single Product API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParamExample {json} Input
     * {
     *      "id" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted your product.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/delete-product/:id
     * @apiErrorExample {json} productDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    deleteProduct(productid, response, request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Remove's Hook if in Memory
            hooks.removeHook('coupon-delete', 'CD1-namespace');
            // --
            // Coupon Plugin
            function couponPlugin(productId, type) {
                if (pluginLoader_1.pluginModule.includes('Coupon')) {
                    hooks.addHook('coupon-delete', 'CD1-namespace', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const importPath = '../../../../add-ons/Coupon/coupon';
                        const Coupon = yield require(importPath);
                        return yield Coupon.CouponProccess(productId, type);
                    }));
                    return true;
                }
                return false;
            }
            // ---
            const product = yield this.productService.findOne(productid);
            if (product === undefined) {
                const errorResponse = {
                    status: 0,
                    message: 'Invalid productId',
                };
                return response.status(400).send(errorResponse);
            }
            const orderProductId = yield this.orderProductService.findOne({ where: { productId: productid } });
            if (orderProductId) {
                const errorResponse = {
                    status: 0,
                    message: 'That product is ordered',
                };
                return response.status(400).send(errorResponse);
            }
            yield this.skuService.delete({ id: product.skuId });
            const deleteProduct = yield this.productService.delete(productid);
            const pluginExist = yield couponPlugin(productid, 1);
            if (pluginExist) {
                yield hooks.runHook('coupon-delete');
            }
            if (deleteProduct) {
                const successResponse = {
                    status: 1,
                    message: 'Successfully deleted your product',
                };
                return response.status(200).send(successResponse);
            }
            else {
                const errorResponse = {
                    status: 0,
                    message: 'unable to delete your product',
                };
                return response.status(400).send(errorResponse);
            }
        });
    }
    // Delete Multiple Product API
    /**
     * @api {post} /api/vendor-product/delete-product Delete Multiple Products API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} productId productId
     * @apiParamExample {json} Input
     * {
     * "productId" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     * "message": "Successfully deleted Product.",
     * "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/delete-product
     * @apiErrorExample {json} productDelete error
     * HTTP/1.1 500 Internal Server Error
     */
    deleteMultipleProduct(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Remove's Hook if in Memory
            hooks.removeHook('coupon-delete', 'CD1-namespace');
            // --
            // Coupon Plugin
            function couponPlugin(productId, type) {
                if (pluginLoader_1.pluginModule.includes('Coupon')) {
                    hooks.addHook('coupon-delete', 'CD1-namespace', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const importPath = '../../../../add-ons/Coupon/coupon';
                        const Coupon = yield require(importPath);
                        return yield Coupon.CouponProccess(productId, type);
                    }));
                    return true;
                }
                return false;
            }
            // ---
            const productIdNo = request.body.productId;
            const productid = productIdNo.split(',');
            for (const id of productid) {
                const dataId = yield this.productService.findOne(id);
                if (dataId === undefined) {
                    const errorResponse = {
                        status: 0,
                        message: 'Please choose a product for delete',
                    };
                    return response.status(400).send(errorResponse);
                }
            }
            for (const id of productid) {
                const orderProductId = yield this.orderProductService.findOne({ where: { productId: id } });
                if (orderProductId) {
                    const errorResponse = {
                        status: 0,
                        message: 'That product is ordered',
                    };
                    return response.status(400).send(errorResponse);
                }
            }
            for (const id of productid) {
                const deleteProductId = parseInt(id, 10);
                const product = yield this.productService.findOne(id);
                yield this.skuService.delete({ id: product.skuId });
                yield this.productService.delete(deleteProductId);
                const pluginExist = yield couponPlugin(deleteProductId, 1);
                if (pluginExist) {
                    yield hooks.runHook('coupon-delete');
                }
            }
            const successResponse = {
                status: 1,
                message: 'Successfully deleted Product',
            };
            return response.status(200).send(successResponse);
        });
    }
    // Vendor Product Detail API
    /**
     * @api {get} /api/vendor-product/vendor-product-detail/:id Vendor Product Detail API
     * @apiGroup  Vendor Product
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get product Detail",
     *      "data":"{}"
     * }
     * @apiSampleRequest /api/vendor-product/vendor-product-detail/:id
     * @apiErrorExample {json} productDetail error
     * HTTP/1.1 500 Internal Server Error
     */
    vendorProductDetail(id, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const vendorProductDetail = yield this.vendorProductService.find({ where: { productId: id, vendorId: request.user.vendorId } });
            if (vendorProductDetail.length === 0) {
                const errorResponse = {
                    status: 0,
                    message: 'invalid productId',
                };
                return response.status(400).send(errorResponse);
            }
            const productDetail = yield this.productService.findOne({
                productId: id,
            });
            const productDetails = (0, class_transformer_1.instanceToPlain)(productDetail);
            const specialCharges = productDetails.serviceCharges;
            if (specialCharges) {
                const specialCharge = JSON.parse(productDetails.serviceCharges);
                productDetails.productCost = specialCharge.productCost;
                productDetails.packingCost = specialCharge.packingCost;
                productDetails.shippingCost = specialCharge.shippingCost;
                productDetails.tax = specialCharge.tax;
                productDetails.others = specialCharge.others;
            }
            const productSku = yield this.skuService.findOne({ id: productDetails.skuId });
            productDetails.quantity = productSku ? productSku.quantity : productDetails.quantity;
            const vendorProduct = yield this.vendorProductService.findOne({
                select: ['vendorId', 'productId', 'approvalFlag'],
                where: { productId: id },
            });
            const vendor = yield this.vendorService.findOne({
                select: ['customerId'],
                where: { vendorId: vendorProduct.vendorId },
            });
            const customer = yield this.customerService.findOne({
                select: ['firstName'],
                where: { id: vendor.customerId },
            });
            productDetails.approvalflag = vendorProduct.approvalFlag;
            productDetails.vendorId = vendorProduct.vendorId;
            productDetails.vendorName = customer.firstName;
            productDetails.productImage = yield this.productImageService.findAll({
                select: ['productId', 'image', 'containerName', 'defaultImage'],
                where: {
                    productId: id,
                },
            });
            productDetails.productVideo = yield this.productVideoService.findOne({
                select: ['id', 'name', 'path', 'type', 'productId'],
                where: { productId: productDetail.productId },
            });
            productDetails.Category = yield this.productToCategoryService.findAll({
                select: ['categoryId', 'productId'],
                where: { productId: id },
            }).then((val) => {
                const category = val.map((value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const categoryValue = yield this.categoryService.findOne({ where: { categoryId: value.categoryId } });
                    const categoryLevel = yield this.categoryPathService.findCategoryLevel(categoryValue.categorySlug);
                    categoryValue.levels = categoryLevel.levels;
                    const temp = categoryValue;
                    return temp;
                }));
                const results = Promise.all(category);
                return results;
            });
            productDetails.productSpecialPrice = yield this.productSpecialService.findAll({
                select: ['productSpecialId', 'priority', 'price', 'dateStart', 'dateEnd', 'skuId'],
                where: { productId: id },
                order: {
                    priority: 'ASC',
                },
            }).then((val) => {
                const special = val.map((value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const skuNames = yield this.skuService.findOne({ id: value.skuId });
                    const temp = value;
                    if (skuNames !== undefined) {
                        temp.skuName = skuNames.skuName;
                    }
                    else {
                        temp.skuName = '';
                    }
                    return temp;
                }));
                const results = Promise.all(special);
                return results;
            });
            // Product tire price
            productDetails.productTirePrices = yield this.productTirePriceService.findAll({
                select: ['id', 'quantity', 'price', 'skuId'],
                where: { productId: productDetail.productId },
            }).then((val) => {
                const tirePrice = val.map((value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const tireSkuNames = yield this.skuService.findOne({ id: value.skuId });
                    const temp = value;
                    if (tireSkuNames !== undefined) {
                        temp.skuName = tireSkuNames.skuName;
                    }
                    else {
                        temp.skuName = '';
                    }
                    return temp;
                }));
                const results = Promise.all(tirePrice);
                return results;
            });
            productDetails.productDiscountData = yield this.productDiscountService.findAll({
                select: ['productDiscountId', 'quantity', 'priority', 'price', 'dateStart', 'dateEnd', 'skuId'],
                where: { productId: id },
                order: {
                    priority: 'ASC',
                },
            }).then((val) => {
                const discount = val.map((value) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const discountSkuNames = yield this.skuService.findOne({ id: value.skuId });
                    const temp = value;
                    if (discountSkuNames !== undefined) {
                        temp.skuName = discountSkuNames.skuName;
                    }
                    else {
                        temp.skuName = '';
                    }
                    return temp;
                }));
                const results = Promise.all(discount);
                return results;
            });
            const successResponse = {
                status: 1,
                message: 'Successfully get productDetail',
                data: productDetails,
            };
            return response.status(200).send(successResponse);
        });
    }
    // Adding Status for vendors product  API
    /**
     * @api {put} /api/vendor-product/add-vendor-product-status/:id Add Vendor Product Status API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} status either should be 1 or 0
     * @apiParamExample {json} Input
     * {
     *      "status" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated status.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/add-vendor-product-status/:id
     * @apiErrorExample {json} product approval error
     * HTTP/1.1 500 Internal Server Error
     */
    addProductStatus(id, status, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const product = yield this.productService.findOne({
                where: {
                    productId: id,
                },
            });
            if (!product) {
                const errorResponse = {
                    status: 0,
                    message: 'Invalid productId',
                };
                return response.status(400).send(errorResponse);
            }
            const vendorProduct = yield this.vendorProductService.findOne({
                where: {
                    productId: id,
                },
            });
            if (vendorProduct.approvalFlag === 0) {
                const errorResponse = {
                    status: 0,
                    message: 'This product is not approved, so you cannot change status.',
                };
                return response.status(400).send(errorResponse);
            }
            product.isActive = status;
            const vendorProductSave = yield this.productService.create(product);
            if (vendorProductSave) {
                const successResponse = {
                    status: 1,
                    message: 'Successfully Updated Status . ',
                    data: vendorProductSave,
                };
                return response.status(200).send(successResponse);
            }
            else {
                const errorResponse = {
                    status: 0,
                    message: 'unable to update product',
                };
                return response.status(400).send(errorResponse);
            }
        });
    }
    // ExportProductsById
    /**
     * @api {get} /api/vendor-product/vendor-product-excel-list Vendor Product Excel sheet
     * @apiGroup Admin Vendor Product
     * @apiParam (Request body) {String} productId productId
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully download the All Vendor Product Excel List..!!",
     *      "status": "1",
     *      "data": {},
     * }
     * @apiSampleRequest /api/vendor-product/vendor-product-excel-list
     * @apiErrorExample {json} Allproduct Excel List error
     * HTTP/1.1 500 Internal Server Error
     */
    ExportAllProductsById(productId, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const excel = require('exceljs');
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('All Product Excel');
            const rows = [];
            // Excel sheet column define
            worksheet.columns = [
                { header: 'Vendor Id', key: 'vendorId', size: 16, width: 15 },
                { header: 'Vendor Name', key: 'VendorName', size: 16, width: 15 },
                { header: 'Product Id', key: 'productId', size: 16, width: 15 },
                { header: 'Product Name', key: 'name', size: 16, width: 15 },
                { header: 'Description', key: 'description', size: 16, width: 30 },
                { header: 'Price', key: 'price', size: 16, width: 15 },
                { header: 'SKU', key: 'sku', size: 16, width: 15 },
                { header: 'UPC', key: 'upc', size: 16, width: 15 },
                { header: 'Quantity', key: 'quantity', size: 16, width: 15 },
                { header: 'Condition', key: 'condition', size: 16, width: 15 },
                { header: 'Rating', key: 'Rating', size: 16, width: 15 },
                { header: 'Related Products', key: 'relatedProducts', size: 16, width: 15 },
                { header: 'IsActive', key: 'isActive', size: 16, width: 15 },
            ];
            worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('H1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('I1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('J1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('K1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('L1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('M1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('N1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('O1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('P1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('Q1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('R1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const productsid = productId.split(',');
            for (const id of productsid) {
                const dataId = yield this.productService.findOne(id);
                if (dataId === undefined) {
                    const errorResponse = {
                        status: 0,
                        message: 'Invalid productId',
                    };
                    return response.status(400).send(errorResponse);
                }
            }
            for (const product of productsid) {
                const data = yield this.productService.findOne(product);
                const productDescription = data.description;
                const dataDescription = productDescription.replace(/(&nbsp;|(<([^>]+)>))/ig, '');
                const vendorProduct = yield this.vendorProductService.findOne({ select: ['vendorId'], where: { productId: data.productId } });
                const vendors = yield this.vendorService.findOne({ select: ['customerId'], where: { vendorId: vendorProduct.vendorId } });
                const customer = yield this.customerService.findOne({ select: ['firstName'], where: { id: vendors.customerId } });
                rows.push([vendorProduct.vendorId, customer.firstName, data.productId, data.name, dataDescription.trim(), data.price, data.sku, data.upc, data.quantity, data.isFeatured, data.todaysDeals, data.condition, data.rating, data.isActive]);
            }
            // Add all rows data in sheet
            worksheet.addRows(rows);
            const worksheet1 = workbook.addWorksheet('special price');
            worksheet1.columns = [
                { header: 'product Special Id', key: 'productSpecialId', size: 16, width: 30 },
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'product Name', key: 'productName', size: 16, width: 15 },
                { header: 'priority', key: 'priority', size: 16, width: 15 },
                { header: 'price', key: 'price', size: 16, width: 30 },
                { header: 'start date', key: 'startDate', size: 16, width: 15 },
                { header: 'end date', key: 'endDate', size: 16, width: 15 },
            ];
            worksheet1.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const special = [];
            const productid = productId.split(',');
            for (const products of productid) {
                const specialPrices = yield this.productSpecialService.findAll({ where: { productId: products } });
                for (const specialPrice of specialPrices) {
                    const productName = yield this.productService.findOne({ where: { productId: specialPrice.productId } });
                    special.push([specialPrice.productSpecialId, specialPrice.productId, productName.name, specialPrice.priority, specialPrice.price, specialPrice.dateStart, specialPrice.dateEnd]);
                }
            }
            // Add all rows data in sheet
            worksheet1.addRows(special);
            const worksheet2 = workbook.addWorksheet('discount price');
            worksheet2.columns = [
                { header: 'product dicount Id', key: 'productDiscountId', size: 16, width: 30 },
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'product name', key: 'productName', size: 16, width: 30 },
                { header: 'priority', key: 'priority', size: 16, width: 15 },
                { header: 'price', key: 'price', size: 16, width: 30 },
                { header: 'start date', key: 'startDate', size: 16, width: 15 },
                { header: 'end date', key: 'endDate', size: 16, width: 15 },
            ];
            worksheet2.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const discount = [];
            const disproductsid = productId.split(',');
            for (const products of disproductsid) {
                const discountPrices = yield this.productDiscountService.findAll({ where: { productId: products } });
                for (const discountPrice of discountPrices) {
                    const productName = yield this.productService.findOne({ where: { productId: discountPrice.productId } });
                    discount.push([discountPrice.productDiscountId, discountPrice.productId, productName.name, discountPrice.priority, discountPrice.price, discountPrice.dateStart, discountPrice.dateEnd]);
                }
            }
            // Add all rows data in sheet
            worksheet2.addRows(discount);
            const worksheet3 = workbook.addWorksheet('Images');
            worksheet3.columns = [
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'product Name', key: 'productName', size: 16, width: 15 },
                { header: 'Image Path', key: 'imagePath', size: 16, width: 15 },
                { header: 'Image', key: 'image', size: 16, width: 30 },
                { header: 'Default Image', key: 'defaultImage', size: 16, width: 30 },
            ];
            worksheet3.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const productimage = [];
            const imageProductId = productId.split(',');
            for (const products of imageProductId) {
                const images = yield this.productImageService.findAll({ where: { productId: products } });
                for (const image of images) {
                    const productName = yield this.productService.findOne({ where: { productId: image.productId } });
                    productimage.push([image.productId, productName.name, image.containerName, image.image, image.defaultImage]);
                }
            }
            // Add all rows data in sheet
            worksheet3.addRows(productimage);
            const worksheet6 = workbook.addWorksheet('Related Category');
            worksheet6.columns = [
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'Category Id', key: 'categoryId', size: 16, width: 15 },
                { header: 'Category Name', key: 'CategoryName', size: 16, width: 30 },
            ];
            worksheet6.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet6.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet6.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const relatedCategory = [];
            const relatedProductId = productId.split(',');
            for (const products of relatedProductId) {
                const categories = yield this.productToCategoryService.findAll({ where: { productId: products } });
                for (const category of categories) {
                    const categoryName = yield this.categoryService.findOne({ where: { categoryId: category.categoryId } });
                    if (categoryName) {
                        relatedCategory.push([category.productId, category.categoryId, categoryName.name]);
                    }
                }
            }
            // Add all rows data in sheet
            worksheet6.addRows(relatedCategory);
            const fileName = './ProductExcel_' + Date.now() + '.xlsx';
            yield workbook.xlsx.writeFile(fileName);
            return new Promise((resolve, reject) => {
                response.download(fileName, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        fs.unlinkSync(fileName);
                        return response.end();
                    }
                });
            });
        });
    }
    // Product Counts
    /**
     * @api {get} /api/vendor-product/product-counts order counts
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get Today order count",
     *      "data":{
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/product-counts
     * @apiErrorExample {json} order error
     * HTTP/1.1 500 Internal Server Error
     */
    productCounts(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const whereCondition = [];
            const relations = [];
            relations.push({
                tableName: 'VendorProducts.product',
                aliasName: 'product',
            }, {
                tableName: 'VendorProducts.vendor',
                aliasName: 'vendor',
            }, {
                tableName: 'vendor.customer',
                aliasName: 'customer',
            });
            whereCondition.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: request.user.vendorId,
            }, {
                name: 'product.isActive',
                op: 'and',
                value: 1,
            });
            const vendorActiveProductListCount = yield this.vendorProductService.listByQueryBuilder(0, 0, [], whereCondition, [], relations, [], [], true, true);
            const inactiveWhereCondition = [];
            inactiveWhereCondition.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: request.user.vendorId,
            }, {
                name: 'product.isActive',
                op: 'and',
                value: 0,
            });
            const vendorInactiveProductListCount = yield this.vendorProductService.listByQueryBuilder(0, 0, [], inactiveWhereCondition, [], relations, [], [], true, true);
            const select = [];
            const relation = [];
            const WhereConditions = [
                {
                    name: 'vendorId',
                    op: 'where',
                    value: request.user.vendorId,
                },
            ];
            const totalProductCount = yield this.vendorProductService.list(0, 0, select, relation, WhereConditions, '', 0);
            const successResponse = {
                status: 1,
                message: 'Successfully get Today Product count',
                data: {
                    inActiveVendorProductList: vendorInactiveProductListCount,
                    activeProductCount: vendorActiveProductListCount,
                    TotalProductCount: totalProductCount.length,
                },
            };
            return response.status(200).send(successResponse);
        });
    }
    // update Quotation Available status API
    /**
     * @api {put} /api/vendor-product/update-quotation-available/:id Update Quotation Available API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} quotationAvailable quotationAvailable should be 0 or 1
     * @apiParamExample {json} Input
     * {
     *      "quotationAvailable" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated product for Quotation Available.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/update-quotation-available/:id
     * @apiErrorExample {json} quotation available error
     * HTTP/1.1 500 Internal Server Error
     */
    updateQuotationAvailable(id, quotationAvailable, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const product = yield this.vendorProductService.findOne({
                where: {
                    productId: id, vendorId: request.user.vendorId,
                },
            });
            if (!product) {
                const errorResponse = {
                    status: 0,
                    message: 'Invalid productId',
                };
                return response.status(400).send(errorResponse);
            }
            product.quotationAvailable = quotationAvailable ? quotationAvailable : 0;
            const productCheck = yield this.productService.findOne({
                where: {
                    productId: id,
                },
            });
            if (productCheck) {
                productCheck.quotationAvailable = quotationAvailable ? quotationAvailable : 0;
                yield this.productService.create(productCheck);
            }
            const productSave = yield this.vendorProductService.create(product);
            if (productSave) {
                const successResponse = {
                    status: 1,
                    message: 'quotation status updated successfully .',
                    data: productSave,
                };
                return response.status(200).send(successResponse);
            }
            else {
                const errorResponse = {
                    status: 0,
                    message: 'unable to update successfully',
                };
                return response.status(400).send(errorResponse);
            }
        });
    }
    validate_slug($slug, $id = 0, $count = 0) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const slugCount = yield this.productService.checkSlug($slug, $id, $count);
            if (slugCount) {
                if (!$count) {
                    $count = 1;
                }
                else {
                    $count++;
                }
                return yield this.validate_slug($slug, $id, $count);
            }
            else {
                if ($count > 0) {
                    $slug = $slug + $count;
                }
                return $slug;
            }
        });
    }
    // Inventory Product List API
    /**
     * @api {get} /api/vendor-product/inventory-vendor-product-list Inventory Product List API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {String} keyword keyword
     * @apiParam (Request body) {String} sku sku
     * @apiParam (Request body) {String} status status
     * @apiParam (Request body) {Number} price=1/2 if 1->asc 2->desc
     * @apiParam (Request body) {Number} count count in number or boolean
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get vendor product list",
     *      "data":"{}"
     * }
     * @apiSampleRequest /api/vendor-product/inventory-vendor-product-list
     * @apiErrorExample {json} productList error
     * HTTP/1.1 500 Internal Server Error
     */
    inventoryVendorProductList(limit, offset, keyword, sku, status, productName, price, count, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const vendorId = request.user.vendorId;
            const selects = ['VendorProducts.vendorProductId as vendorProductId',
                'VendorProducts.approvalFlag as approvalFlag',
                'VendorProducts.vendorId as vendorId',
                'product.productId as productId',
                'product.name as name',
                'product.sku as sku',
                'product.price as productprice',
                'product.quantity as quantity',
                'product.sortOrder as sortOrder',
                'product.isActive as isActive',
                'product.productSlug as productSlug',
                'product.hasStock as hasStock',
                'product.hasTirePrice as hasTirePrice',
                'product.outOfStockThreshold as outOfStockThreshold',
                'product.notifyMinQuantity as notifyMinQuantity',
                'product.minQuantityAllowedCart as minQuantityAllowedCart',
                'product.maxQuantityAllowedCart as maxQuantityAllowedCart',
                'product.enableBackOrders as enableBackOrders',
                'product.modifiedDate as modifiedDate',
                'product.isSimplified as isSimplified',
                'product.skuId as skuId',
                'VendorProducts.createdDate as createdDate',
                'product.keywords as keywords',
                'product.attributeKeyword as attributeKeyword'];
            const whereCondition = [];
            const relations = [];
            const groupBy = [];
            relations.push({
                tableName: 'VendorProducts.product',
                aliasName: 'product',
            });
            whereCondition.push({
                name: 'product.isSimplified',
                op: 'and',
                value: 1,
            });
            whereCondition.push({
                name: 'VendorProducts.vendorId',
                op: 'and',
                value: vendorId,
            });
            if (status) {
                whereCondition.push({
                    name: 'product.isActive',
                    op: 'and',
                    value: status,
                });
            }
            if (price && price !== '') {
                whereCondition.push({
                    name: 'product.price',
                    op: 'and',
                    value: price,
                });
            }
            const searchConditions = [];
            if (keyword) {
                searchConditions.push({
                    name: ['product.keywords', 'product.name', 'product.sku'],
                    value: keyword.toLowerCase(),
                });
            }
            if (sku && sku !== '') {
                searchConditions.push({
                    name: ['product.sku'],
                    value: sku.toLowerCase(),
                });
            }
            if (productName && productName !== '') {
                searchConditions.push({
                    name: ['product.name'],
                    value: productName.toLowerCase(),
                });
            }
            const sort = [];
            sort.push({
                name: 'VendorProducts.createdDate',
                order: 'DESC',
            });
            if (count) {
                const vendorProductListCount = yield this.vendorProductService.listByQueryBuilder(limit, offset, selects, whereCondition, searchConditions, relations, groupBy, sort, true, true);
                const sucResponse = {
                    status: 1,
                    message: 'Successfully got Vendor Product list.',
                    data: vendorProductListCount,
                };
                return response.status(200).send(sucResponse);
            }
            const vendorProductLists = yield this.vendorProductService.listByQueryBuilder(limit, offset, selects, whereCondition, searchConditions, relations, groupBy, sort, false, true);
            const promise = vendorProductLists.map((result) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let skuValue = undefined;
                skuValue = yield this.skuService.findAll({ where: { id: result.skuId } });
                const temp = result;
                temp.skuValue = skuValue;
                return temp;
            }));
            const value = yield Promise.all(promise);
            const successResponse = {
                status: 1,
                message: 'Successfully got the complete product list. ',
                data: value,
            };
            return response.status(200).send(successResponse);
        });
    }
    // update stock  API
    /**
     * @api {post} /api/vendor-product/update-stock Update Stock API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {number} productId productId
     * @apiParam (Request body) {number} hasStock send 0 or 1
     * @apiParam (Request body) {object} productStock
     * @apiParam (Request body) {number} productStock.skuId skuId
     * @apiParam (Request body) {number} productStock.outOfStockThreshold for setting out of stock threshold
     * @apiParam (Request body) {number} productStock.notifyMinQuantity notifyMinQuantity
     * @apiParam (Request body) {number} productStock.minQuantityAllowedCart  minQuantityAllowedCart
     * @apiParam (Request body) {number} productStock.maxQuantityAllowedCart maxQuantityAllowedCart
     * @apiParam (Request body) {number} productStock.enableBackOrders enableBackOrders
     * @apiParamExample {json} Input
     * {
     *      "hasStock" : "",
     *      "productId" : "",
     *      "productStock": [{
     *      "skuId" : "",
     *      "outOfStockThreshold" : "",
     *      "notifyMinQuantity" : "",
     *      "minQuantityAllowedCart" : "",
     *      "maxQuantityAllowedCart" : "",
     *      "enableBackOrders" : "",
     *      }]
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated product stock.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/update-stock
     * @apiErrorExample {json} stock error
     * HTTP/1.1 500 Internal Server Error
     */
    manageStock(updateStock, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const product = yield this.productService.findOne({
                where: {
                    productId: updateStock.productId,
                },
            });
            if (!product) {
                const errorResponse = {
                    status: 0,
                    message: 'Invalid productId',
                };
                return response.status(400).send(errorResponse);
            }
            const vendorProduct = yield this.vendorProductService.findOne({
                where: {
                    productId: updateStock.productId,
                    vendorId: request.user.vendorId,
                },
            });
            if (!vendorProduct) {
                const errorResponse = {
                    status: 0,
                    message: 'Invalid product for this vendor',
                };
                return response.status(400).send(errorResponse);
            }
            product.hasStock = updateStock.hasStock;
            const productValue = yield this.productService.create(product);
            const productStock = updateStock.productStock;
            const valArr = [];
            for (const value of productStock) {
                const sku = yield this.skuService.findOne({
                    where: {
                        id: value.skuId,
                    },
                });
                if (!sku) {
                    const errorResponse = {
                        status: 0,
                        message: 'Invalid skuId',
                    };
                    return response.status(400).send(errorResponse);
                }
                sku.outOfStockThreshold = value.outOfStockThreshold ? value.outOfStockThreshold : sku.outOfStockThreshold;
                sku.notifyMinQuantity = value.notifyMinQuantity ? value.notifyMinQuantity : sku.notifyMinQuantity;
                sku.minQuantityAllowedCart = value.minQuantityAllowedCart ? value.minQuantityAllowedCart : sku.minQuantityAllowedCart;
                sku.maxQuantityAllowedCart = value.maxQuantityAllowedCart ? value.maxQuantityAllowedCart : sku.maxQuantityAllowedCart;
                sku.enableBackOrders = value.enableBackOrders ? value.enableBackOrders : sku.enableBackOrders;
                valArr.push(sku);
            }
            yield this.skuService.create(valArr);
            if (productValue) {
                const successResponse = {
                    status: 1,
                    message: 'Successfully updated stock .',
                    data: productValue,
                };
                return response.status(200).send(successResponse);
            }
            else {
                const errorResponse = {
                    status: 0,
                    message: 'unable to update',
                };
                return response.status(400).send(errorResponse);
            }
        });
    }
    // Product Details Excel Document download
    /**
     * @api {get} /api/vendor-product/product-excel-list Product Excel
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {String} productId productId
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully download the Product Excel List..!!",
     *      "status": "1",
     *      "data": {},
     * }
     * @apiSampleRequest /api/vendor-product/product-excel-list
     * @apiErrorExample {json} product Excel List error
     * HTTP/1.1 500 Internal Server Error
     */
    excelProductView(productId, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const excel = require('exceljs');
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('Product Detail Sheet');
            const rows = [];
            const productid = productId.split(',');
            for (const id of productid) {
                const dataId = yield this.vendorProductService.findOne({
                    where: {
                        vendorId: request.user.vendorId,
                        productId: id,
                    },
                });
                if (dataId === undefined) {
                    const errorResponse = {
                        status: 0,
                        message: 'Invalid productId',
                    };
                    return response.status(400).send(errorResponse);
                }
            }
            // Excel sheet column define
            worksheet.columns = [
                { header: 'Product Id', key: 'productId', size: 16, width: 15 },
                { header: 'Product Name', key: 'name', size: 16, width: 15 },
                { header: 'Description', key: 'description', size: 16, width: 30 },
                { header: 'Price', key: 'price', size: 16, width: 15 },
                { header: 'SKU', key: 'sku', size: 16, width: 15 },
                { header: 'UPC', key: 'upc', size: 16, width: 15 },
                { header: 'Quantity', key: 'quantity', size: 16, width: 15 },
                { header: 'Minimum Quantity', key: 'minimumQuantity', size: 16, width: 19 },
                { header: 'Subtract Stock', key: 'subtractstock', size: 16, width: 15 },
                { header: 'Manufacture Id', key: 'manufactureId', size: 16, width: 15 },
            ];
            worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('H1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('I1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('J1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            for (const id of productid) {
                const dataId = yield this.productService.findOne(id);
                const productDescription = dataId.description;
                const dataDescription = productDescription.replace(/(&nbsp;|(<([^>]+)>))/ig, '');
                rows.push([dataId.productId, dataId.name, dataDescription.trim(), dataId.price, dataId.sku, dataId.upc, dataId.quantity, dataId.minimumQuantity, dataId.subtractStock]);
            }
            // Add all rows data in sheet
            worksheet.addRows(rows);
            const fileName = './ProductExcel_' + Date.now() + '.xlsx';
            yield workbook.xlsx.writeFile(fileName);
            return new Promise((resolve, reject) => {
                response.download(fileName, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        fs.unlinkSync(fileName);
                        return response.end();
                    }
                });
            });
        });
    }
    // ExportAllProducts
    /**
     * @api {get} /api/vendor-product/allproduct-excel-list AllProduct Excel sheet
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully download the All Product Excel List..!!",
     *      "status": "1",
     *      "data": {},
     * }
     * @apiSampleRequest /api/vendor-product/allproduct-excel-list
     * @apiErrorExample {json} Allproduct Excel List error
     * HTTP/1.1 500 Internal Server Error
     */
    ExportAllProducts(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const excel = require('exceljs');
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('All Product Excel');
            const rows = [];
            const dataId = yield this.vendorProductService.find({ where: { vendorId: request.user.vendorId } });
            if (dataId === undefined) {
                const errorResponse = {
                    status: 0,
                    message: 'Products are empty',
                };
                return response.status(400).send(errorResponse);
            }
            // Excel sheet column define
            worksheet.columns = [
                { header: 'Product Id', key: 'productId', size: 16, width: 15 },
                { header: 'Product Name', key: 'name', size: 16, width: 15 },
                { header: 'Description', key: 'description', size: 16, width: 30 },
                { header: 'Price', key: 'price', size: 16, width: 15 },
                { header: 'SKU', key: 'sku', size: 16, width: 15 },
                { header: 'UPC', key: 'upc', size: 16, width: 15 },
                { header: 'Quantity', key: 'quantity', size: 16, width: 15 },
                { header: 'Minimum Quantity', key: 'minimumQuantity', size: 16, width: 19 },
                { header: 'Subtract Stock', key: 'subtractstock', size: 16, width: 15 },
                { header: 'Rating', key: 'Rating', size: 16, width: 15 },
                { header: 'Related Products', key: 'relatedProducts', size: 16, width: 15 },
                { header: 'IsActive', key: 'isActive', size: 16, width: 15 },
            ];
            worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('H1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('I1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('J1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('K1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('L1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.getCell('M1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const vendorId = request.user.vendorId;
            const selects = [
                'vendor.vendorId as vendorId',
                'product.productId as productId',
                'product.name as name',
                'product.sku as sku',
                'product.upc as upc',
                'product.price as productPrice',
                'product.quantity as quantity',
                'product.description as description',
                'product.sortOrder as sortOrder',
                'product.isActive as isActive',
                'product.rating as rating',
                'product.productSlug as productSlug',
                'VendorProducts.createdDate as createdDate',
                'product.keywords as keywords',
                'product.minimumQuantity as minimumQuantity',
                'product.subtractStock as subtractStock',
            ];
            const whereCondition = [];
            const relations = [];
            const groupBy = [];
            relations.push({
                tableName: 'VendorProducts.product',
                aliasName: 'product',
            }, {
                tableName: 'VendorProducts.vendor',
                aliasName: 'vendor',
            });
            whereCondition.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: vendorId,
            });
            const searchConditions = [];
            const sort = [];
            sort.push({
                name: 'VendorProducts.createdDate',
                order: 'DESC',
            });
            const vendorProductLists = yield this.vendorProductService.listByQueryBuilder(0, 0, selects, whereCondition, searchConditions, relations, groupBy, sort, false, true);
            for (const products of vendorProductLists) {
                const productDescription = products.description;
                const dataDescription = productDescription.replace(/(&nbsp;|(<([^>]+)>))/ig, '');
                rows.push([products.productId, products.name, dataDescription.trim(), products.productPrice, products.sku, products.upc, products.quantity, products.minimumQuantity, products.subtractStock, products.rating, products.isActive]);
            }
            // Add all rows data in sheet
            worksheet.addRows(rows);
            const worksheet1 = workbook.addWorksheet('special price');
            worksheet1.columns = [
                { header: 'product Special Id', key: 'productSpecialId', size: 16, width: 30 },
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'product Name', key: 'productName', size: 16, width: 15 },
                { header: 'priority', key: 'priority', size: 16, width: 15 },
                { header: 'price', key: 'price', size: 16, width: 30 },
                { header: 'start date', key: 'startDate', size: 16, width: 15 },
                { header: 'end date', key: 'endDate', size: 16, width: 15 },
            ];
            worksheet1.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet1.getCell('G1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const special = [];
            const selectSpecial = ['VendorProducts.vendorProductId as vendorProductId',
                'vendor.vendorId as vendorId',
                'product.productId as productId',
                'product.name as name',
                'productSpecial.productSpecialId as productSpecialId',
                'productSpecial.priority as priority',
                'productSpecial.price as price',
                'productSpecial.dateStart as dateStart',
                'productSpecial.dateEnd as dateEnd',
            ];
            const whereConditionSpecial = [];
            const relationsSpecial = [];
            const groupBySpecial = [];
            relationsSpecial.push({
                tableName: 'VendorProducts.product',
                op: 'inner',
                aliasName: 'product',
            }, {
                tableName: 'VendorProducts.vendor',
                op: 'inner',
                aliasName: 'vendor',
            }, {
                tableName: 'product.productSpecial',
                op: 'inner',
                aliasName: 'productSpecial',
            });
            whereConditionSpecial.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: vendorId,
            });
            const SearchConditionsSpecial = [];
            const specialSort = [];
            sort.push({
                name: 'VendorProducts.createdDate',
                order: 'DESC',
            });
            const vendorProductSpecialList = yield this.vendorProductService.listByQueryBuilder(0, 0, selectSpecial, whereConditionSpecial, SearchConditionsSpecial, relationsSpecial, groupBySpecial, specialSort, false, true);
            for (const specialPrice of vendorProductSpecialList) {
                special.push([specialPrice.productSpecialId, specialPrice.productId, specialPrice.name, specialPrice.priority, specialPrice.price, specialPrice.dateStart, specialPrice.dateEnd]);
            }
            // Add all rows data in sheet
            worksheet1.addRows(special);
            const worksheet2 = workbook.addWorksheet('discount price');
            worksheet2.columns = [
                { header: 'product dicount Id', key: 'productDiscountId', size: 16, width: 30 },
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'product name', key: 'productName', size: 16, width: 30 },
                { header: 'priority', key: 'priority', size: 16, width: 15 },
                { header: 'price', key: 'price', size: 16, width: 30 },
                { header: 'start date', key: 'startDate', size: 16, width: 15 },
                { header: 'end date', key: 'endDate', size: 16, width: 15 },
            ];
            worksheet2.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet2.getCell('F1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const discount = [];
            const selectDiscount = ['VendorProducts.vendorProductId as vendorProductId',
                'vendor.vendorId as vendorId',
                'product.productId as productId',
                'product.name as name',
                'productDiscount.productDiscountId as productDiscountId',
                'productDiscount.priority as priority',
                'productDiscount.price as price',
                'productDiscount.dateStart as dateStart',
                'productDiscount.dateEnd as dateEnd',
            ];
            const whereConditionDiscount = [];
            const relationsDiscount = [];
            const groupByDiscount = [];
            relationsDiscount.push({
                tableName: 'VendorProducts.product',
                op: 'inner',
                aliasName: 'product',
            }, {
                tableName: 'VendorProducts.vendor',
                op: 'inner',
                aliasName: 'vendor',
            }, {
                tableName: 'product.productDiscount',
                op: 'inner',
                aliasName: 'productDiscount',
            });
            whereConditionDiscount.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: vendorId,
            });
            const SearchConditionsDiscount = [];
            const discountSort = [];
            sort.push({
                name: 'VendorProducts.createdDate',
                order: 'DESC',
            });
            const vendorProductDiscountList = yield this.vendorProductService.listByQueryBuilder(0, 0, selectDiscount, whereConditionDiscount, SearchConditionsDiscount, relationsDiscount, groupByDiscount, discountSort, false, true);
            for (const discountPrice of vendorProductDiscountList) {
                discount.push([discountPrice.productDiscountId, discountPrice.productId, discountPrice.name, discountPrice.priority, discountPrice.price, discountPrice.dateStart, discountPrice.dateEnd]);
            }
            // Add all rows data in sheet
            worksheet2.addRows(discount);
            const worksheet3 = workbook.addWorksheet('Images');
            worksheet3.columns = [
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'product Name', key: 'productName', size: 16, width: 30 },
                { header: 'Image Path', key: 'imagePath', size: 16, width: 15 },
                { header: 'Image', key: 'image', size: 16, width: 30 },
                { header: 'Default Image', key: 'defaultImage', size: 16, width: 30 },
            ];
            worksheet3.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('D1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet3.getCell('E1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const productimage = [];
            const selectImages = [
                'product.productId as productId',
                'product.name as productName',
                'productImage.containerName as imagePath',
                'productImage.image as image',
                'productImage.defaultImage as defaultImage',
            ];
            const whereConditionsImages = [];
            const relationsImages = [];
            const groupByImages = [];
            relationsImages.push({
                tableName: 'VendorProducts.product',
                op: 'inner',
                aliasName: 'product',
            }, {
                tableName: 'VendorProducts.vendor',
                op: 'inner',
                aliasName: 'vendor',
            }, {
                tableName: 'product.productImage',
                op: 'inner',
                aliasName: 'productImage',
            });
            whereConditionsImages.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: vendorId,
            });
            const sortImages = [];
            const searchConditionsImages = [];
            sort.push({
                name: 'VendorProducts.createdDate',
                order: 'DESC',
            });
            const vendorProductImagesList = yield this.vendorProductService.listByQueryBuilder(0, 0, selectImages, whereConditionsImages, searchConditionsImages, relationsImages, groupByImages, sortImages, false, true);
            for (const image of vendorProductImagesList) {
                productimage.push([image.productId, image.productName, image.imagePath, image.image, image.defaultImage]);
            }
            // // Add all rows data in sheet
            worksheet3.addRows(productimage);
            const worksheet4 = workbook.addWorksheet('Related Category');
            worksheet4.columns = [
                { header: 'product Id', key: 'productId', size: 16, width: 15 },
                { header: 'Category Id', key: 'categoryId', size: 16, width: 15 },
                { header: 'Category Name', key: 'CategoryName', size: 16, width: 30 },
            ];
            worksheet4.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet4.getCell('B1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet4.getCell('C1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            const relatedCategory = [];
            const selectRelatedCategory = [
                'product.productId as productId',
                'category.categoryId as categoryId',
                'category.name as name',
            ];
            const whereConditionsRelatedCategory = [];
            const relationsRelatedCategory = [];
            const groupByRelatedCategory = [];
            relationsRelatedCategory.push({
                tableName: 'VendorProducts.product',
                op: 'inner',
                aliasName: 'product',
            }, {
                tableName: 'VendorProducts.vendor',
                op: 'inner',
                aliasName: 'vendor',
            }, {
                tableName: 'product.productToCategory',
                op: 'inner',
                aliasName: 'productToCategory',
            }, {
                tableName: 'productToCategory.category',
                op: 'inner',
                aliasName: 'category',
            });
            whereConditionsRelatedCategory.push({
                name: 'vendor.vendorId',
                op: 'and',
                value: vendorId,
            });
            const sortRelatedCategory = [];
            const searchConditionsRelatedCategory = [];
            sort.push({
                name: 'VendorProducts.createdDate',
                order: 'DESC',
            });
            const categories = yield this.vendorProductService.listByQueryBuilder(0, 0, selectRelatedCategory, whereConditionsRelatedCategory, searchConditionsRelatedCategory, relationsRelatedCategory, groupByRelatedCategory, sortRelatedCategory, false, true);
            for (const category of categories) {
                relatedCategory.push([category.productId, category.categoryId, category.name]);
            }
            // Add all rows data in sheet
            worksheet4.addRows(relatedCategory);
            const fileName = './ProductExcel_' + Date.now() + '.xlsx';
            yield workbook.xlsx.writeFile(fileName);
            return new Promise((resolve, reject) => {
                response.download(fileName, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        fs.unlinkSync(fileName);
                        return response.end();
                    }
                });
            });
        });
    }
    // Vendor Category List by Group API
    /**
     * @api {get} /api/vendor-product/vendor-category-list Vendor Category List API
     * @apiGroup Vendor Product
     * @apiHeader {String} Authorization
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {Boolean} count count should be number or boolean
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get vendor category list",
     *      "data":{
     *       "vendorId" : "",
     *       "vendorCategoryId" : "",
     *       "categoryId" : "",
     *      }
     *      "status": "1"
     * }
     * @apiSampleRequest /api/vendor-product/vendor-category-list
     * @apiErrorExample {json} Vendor category error
     * HTTP/1.1 500 Internal Server Error
     */
    vendorCategoryListbyGroup(limit, offset, keyword, count, request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const vendorId = request.user.vendorId;
            const findvendor = yield this.vendorService.findOne({ where: { vendorId } });
            const select = [
                'CategoryPath.categoryId as categoryId',
                'category.sortOrder as sortOrder',
                'category.parentInt as parentInt',
                'category.name as categoryName',
                'GROUP_CONCAT' + '(' + 'path.name' + ' ' + 'ORDER BY' + ' ' + 'CategoryPath.level' + ' ' + 'SEPARATOR' + " ' " + '>' + " ' " + ')' + ' ' + 'as' + ' ' + 'levels',
            ];
            const relations = [
                {
                    tableName: 'CategoryPath.category',
                    aliasName: 'category',
                },
                {
                    tableName: 'CategoryPath.path',
                    aliasName: 'path',
                },
                {
                    tableName: 'category.vendorGroupCategory',
                    aliasName: 'vendorGroupCategory',
                },
            ];
            const groupBy = [
                {
                    name: 'CategoryPath.category_id',
                },
            ];
            const whereConditions = [];
            const searchConditions = [];
            whereConditions.push({
                name: 'vendorGroupCategory.vendor_group_id',
                op: 'and',
                value: findvendor.vendorGroupId,
            });
            const sort = [];
            sort.push({
                name: 'vendorGroupCategory.category_id',
                order: 'ASC',
            });
            const vendorCategoryList = yield this.categoryPathService.listByQueryBuilder(limit, offset, select, whereConditions, searchConditions, relations, groupBy, sort, false, true);
            const successResponse = {
                status: 1,
                message: 'Successfully got the vendor category list.',
                data: vendorCategoryList,
            };
            return response.status(200).send(successResponse);
        });
    }
    checlApi(file, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const AcceptedFilesType = [
                '.doc',
                '.docx',
                '.pdf',
                '.tif',
                '.tiff',
                '.zip',
                '.jpg',
                '.jpeg',
                '.bmp',
                '.png',
                '.msg',
                '.xls',
                '.xlsx',
                '.csv',
            ];
            const extension = path.extname(file.originalname);
            if (!AcceptedFilesType.includes(extension)) {
                return response.status(400).send({
                    status: 0,
                    message: 'Only doc, docx, pdf, tif, tiff, zip, jpg, jpeg, bmp, png, msg, xls, xlsx and csv file are accepted',
                });
            }
            const imageContainerName = `Product/`;
            const fileNames = `${Date.now()}_additional${extension}`;
            let result;
            if (env_1.env.imageserver === 's3') {
                result = yield this.s3Service.imageUpload(fileNames, file.buffer, extension);
            }
            else {
                result = yield this.imageService.imageUpload(`${imageContainerName}${fileNames}`, file.buffer);
            }
            if (result) {
                const SuccessExample = {
                    status: 1,
                    message: 'Uploaded successfully',
                    containerName: imageContainerName,
                    fileName: fileNames,
                };
                response.status(200).send(SuccessExample);
            }
        });
    }
    additionalFileDownload(fileName, containerName, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let val;
            if (env_1.env.imageserver === 's3') {
                val = yield this.s3Service.fileDownload(containerName, fileName);
            }
            else {
                val = yield this.imageService.fileDownload(containerName, fileName);
            }
            if (val) {
                return new Promise((resolve, reject) => {
                    response.download(val, fileName);
                });
            }
            else {
                return response.status(400).send({ status: 0, message: 'Download Failed' });
            }
        });
    }
};
tslib_1.__decorate([
    (0, routing_controllers_1.Post)('/create-vendor-product'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Body)({ validate: true })),
    tslib_1.__param(1, (0, routing_controllers_1.Req)()),
    tslib_1.__param(2, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [VendorProductRequest_1.VendorProductRequest, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "createProduct", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)('/update-vendor-product/:id'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Param)('id')),
    tslib_1.__param(1, (0, routing_controllers_1.Body)({ validate: true })),
    tslib_1.__param(2, (0, routing_controllers_1.Req)()),
    tslib_1.__param(3, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, VendorProductRequest_1.VendorProductRequest, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "updateProduct", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/vendor-product-list'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)('limit')),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)('offset')),
    tslib_1.__param(2, (0, routing_controllers_1.QueryParam)('status')),
    tslib_1.__param(3, (0, routing_controllers_1.QueryParam)('keyword')),
    tslib_1.__param(4, (0, routing_controllers_1.QueryParam)('price')),
    tslib_1.__param(5, (0, routing_controllers_1.QueryParam)('productName')),
    tslib_1.__param(6, (0, routing_controllers_1.QueryParam)('vendorName')),
    tslib_1.__param(7, (0, routing_controllers_1.QueryParam)('count')),
    tslib_1.__param(8, (0, routing_controllers_1.QueryParam)('sku')),
    tslib_1.__param(9, (0, routing_controllers_1.Req)()),
    tslib_1.__param(10, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String, String, String, String, String, Number, String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "vendorProductList", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Delete)('/delete-product/:id'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Param)('id')),
    tslib_1.__param(1, (0, routing_controllers_1.Res)()),
    tslib_1.__param(2, (0, routing_controllers_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "deleteProduct", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)('/delete-product'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Req)()),
    tslib_1.__param(1, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "deleteMultipleProduct", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/vendor-product-detail/:id'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Param)('id')),
    tslib_1.__param(1, (0, routing_controllers_1.Req)()),
    tslib_1.__param(2, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "vendorProductDetail", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)('/add-vendor-product-status/:id'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Param)('id')),
    tslib_1.__param(1, (0, routing_controllers_1.BodyParam)('status')),
    tslib_1.__param(2, (0, routing_controllers_1.Req)()),
    tslib_1.__param(3, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "addProductStatus", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/vendor-product-excel-list'),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)('productId')),
    tslib_1.__param(1, (0, routing_controllers_1.Req)()),
    tslib_1.__param(2, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "ExportAllProductsById", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/product-counts'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Req)()),
    tslib_1.__param(1, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "productCounts", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)('/update-quotation-available/:id'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Param)('id')),
    tslib_1.__param(1, (0, routing_controllers_1.BodyParam)('quotationAvailable')),
    tslib_1.__param(2, (0, routing_controllers_1.Req)()),
    tslib_1.__param(3, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "updateQuotationAvailable", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/inventory-vendor-product-list'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)('limit')),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)('offset')),
    tslib_1.__param(2, (0, routing_controllers_1.QueryParam)('keyword')),
    tslib_1.__param(3, (0, routing_controllers_1.QueryParam)('sku')),
    tslib_1.__param(4, (0, routing_controllers_1.QueryParam)('status')),
    tslib_1.__param(5, (0, routing_controllers_1.QueryParam)('ProductName')),
    tslib_1.__param(6, (0, routing_controllers_1.QueryParam)('price')),
    tslib_1.__param(7, (0, routing_controllers_1.QueryParam)('count')),
    tslib_1.__param(8, (0, routing_controllers_1.Req)()),
    tslib_1.__param(9, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String, String, String, String, String, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "inventoryVendorProductList", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)('/update-stock'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Body)({ validate: true })),
    tslib_1.__param(1, (0, routing_controllers_1.Req)()),
    tslib_1.__param(2, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [UpdateStockRequest_1.UpdateStockRequest, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "manageStock", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/product-excel-list'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)('productId')),
    tslib_1.__param(1, (0, routing_controllers_1.Req)()),
    tslib_1.__param(2, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "excelProductView", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/allproduct-excel-list'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.Req)()),
    tslib_1.__param(1, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "ExportAllProducts", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/vendor-category-list'),
    (0, routing_controllers_1.Authorized)('vendor'),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)('limit')),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)('offset')),
    tslib_1.__param(2, (0, routing_controllers_1.QueryParam)('keyword')),
    tslib_1.__param(3, (0, routing_controllers_1.QueryParam)('count')),
    tslib_1.__param(4, (0, routing_controllers_1.Req)()),
    tslib_1.__param(5, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String, Boolean, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "vendorCategoryListbyGroup", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)('/vendor-product-additional-file'),
    tslib_1.__param(0, (0, routing_controllers_1.UploadedFile)('file')),
    tslib_1.__param(1, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "checlApi", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/vendor-product-additional-file-download'),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)('fileName')),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)('containerName')),
    tslib_1.__param(2, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VendorProductController.prototype, "additionalFileDownload", null);
VendorProductController = tslib_1.__decorate([
    (0, routing_controllers_1.JsonController)('/vendor-product'),
    tslib_1.__metadata("design:paramtypes", [ProductService_1.ProductService,
        S3Service_1.S3Service,
        ProductToCategoryService_1.ProductToCategoryService,
        ProductImageService_1.ProductImageService,
        CategoryService_1.CategoryService,
        VendorProductAdditionalFileService_1.VendorProductAdditionalFileService,
        ProductDiscountService_1.ProductDiscountService,
        ProductSpecialService_1.ProductSpecialService,
        OrderProductService_1.OrderProductService,
        CustomerService_1.CustomerService,
        VendorService_1.VendorService,
        SkuService_1.SkuService,
        VendorProductService_1.VendorProductService,
        ProductTirePriceService_1.ProductTirePriceService,
        ProductVideoService_1.ProductVideoService,
        CategoryPathService_1.CategoryPathService,
        ImageService_1.ImageService])
], VendorProductController);
exports.VendorProductController = VendorProductController;
//# sourceMappingURL=VendorProductController.js.map