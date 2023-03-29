/*
* Spurtcommerce
* https://www.spurtcommerce.com
* Copyright (c) 2023  Spurtcommerce E-solutions Private Limited
* Author Spurtcommerce E-solutions Private Limited <support@spurtcommerce.com>
* Licensed under the MIT license.
*/

import 'reflect-metadata';
import {
    JsonController,
    Res,
    Body,
    Req,
    Post,
} from 'routing-controllers';
import { PluginService } from '../../core/services/PluginService';

@JsonController('/admin-gmap')
export class AdminGmapController {
    constructor(
        private pluginService: PluginService
    ) {}

    @Post('/update-setting')
    public async updateSetting(@Body({ validate: true }) postParams: any, @Req() request: any, @Res() response: any): Promise<any> {
        const pluginDetail = await this.pluginService.findOne({
            where: {
                pluginName: 'gmap',
            },
        });
        if (!pluginDetail) {
            return response.status(400).send({
                status: 1,
                message: 'You not install this plugin. or problem in installation',
            });
        }
        const paypalAdditionalInfo = pluginDetail.pluginAdditionalInfo ? JSON.parse(pluginDetail.pluginAdditionalInfo) : {};
        paypalAdditionalInfo.clientId = postParams.clientId;
        paypalAdditionalInfo.clientSecret = postParams.clientSecret;
        paypalAdditionalInfo.isTest = postParams.isTest;
        pluginDetail.pluginAdditionalInfo = JSON.stringify(paypalAdditionalInfo);
        const saveResponse = await this.pluginService.create(pluginDetail);
        if (saveResponse) {
            return response.status(200).send({
                status: 1,
                message: 'Gmap settings updated successfully',
            });
        }
        const errorResponse: any = {
            status: 1,
            message: 'Unable to update the Gmap settings',
        };
        return response.status(400).send(errorResponse);
    }
}