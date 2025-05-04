import { injectable } from 'inversify';

@injectable()
export class CustomerService {
  // private readonly userExpireSeconds = 240; // 4 min

  // private async _getCustomerConfigurationsCache(ids: number[]) {
  //   return (
  //     await this.redisService.client.mget(
  //       ids.map((id) => CustomerService.customerCacheKey(id, 'configuration'))
  //     )
  //   )
  //     .map((entry) => {
  //       if (!entry) return entry;
  //       return JSON.parse(entry);
  //     })
  //     .filter(Boolean) as UserConfiguration[];
  // }

  // private async _setCustomerConfigurationsCache(
  //   configurations: { id: number; user: UserConfiguration }[]
  // ) {
  //   const redisBatch = this.redisService.client.multi();
  //   for (const { id, user } of configurations) {
  //     redisBatch.set(
  //       CustomerService.customerCacheKey(id, 'configuration'),
  //       JSON.stringify(user),
  //       'EX',
  //       this.userExpireSeconds
  //     );
  //   }
  //   await redisBatch.exec();
  // }

  // static customerCacheKey(
  //   customerId: number,
  //   suffix: 'configuration' | 'triggers/blocked'
  // ) {
  //   return `customers:${customerId}/${suffix}`;
  // }

  // static retriveJwtToken(headerContent?: string): string | null {
  //   if (!headerContent) return null;
  //   return headerContent.replace(/^Bearer\s+/, '');
  // }

  // static getUser(token?: string): JwtCustomer | null {
  //   if (!token) {
  //     return null;
  //   } else {
  //     const jwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY || '', {
  //       algorithms: ['HS256'],
  //     }) as unknown as JwtCustomer;

  //     return jwtPayload;
  //   }
  // }

  // constructor(
  //   @inject(RedisService)
  //   private readonly redisService: RedisService
  // ) {}

  // async getCustomerConfiguration(
  //   id: number,
  //   cache = true
  // ): Promise<UserConfiguration> {
  //   if (cache) {
  //     const cachedCustomerConfiguration = await this.redisService.client.get(
  //       CustomerService.customerCacheKey(id, 'configuration')
  //     );
  //     if (cachedCustomerConfiguration)
  //       return JSON.parse(cachedCustomerConfiguration) as UserConfiguration;
  //   }

  //   const { data } = await axios.get<UserConfiguration>(
  //     `${process.env.NODE_API_URL}/api/users/configuration/${id}`,
  //     {
  //       params: {
  //         serviceId: [2, 3, 7],
  //       },
  //       headers: {
  //         'x-api-key': process.env.NODE_API_KEY,
  //       },
  //     }
  //   );
  //   if (!data) throw new Error('Can not retrive customer data');

  //   await this.redisService.client.set(
  //     CustomerService.customerCacheKey(id, 'configuration'),
  //     JSON.stringify(data)
  //   );
  //   return data;
  // }

  // async getCustomerConfigurations({
  //   userId,
  // }: {
  //   userId: number[];
  // }): Promise<UserConfiguration[]> {
  //   const cachedCustomerConfigurations =
  //     await this._getCustomerConfigurationsCache(userId);
  //   const cachedCustomerConfigurationsIds = cachedCustomerConfigurations.map(
  //     (e) => e.id
  //   );
  //   const missingCustomerIds = userId.filter(
  //     (id) => !cachedCustomerConfigurationsIds.includes(id)
  //   );

  //   if (missingCustomerIds.length) {
  //     const { data } = await axios.post<UserConfiguration[]>(
  //       `${process.env.NODE_API_URL}/api/users/configuration`,
  //       {
  //         userId: missingCustomerIds,
  //         serviceId: [2, 3, 7],
  //       },
  //       {
  //         headers: {
  //           'x-api-key': process.env.NODE_API_KEY,
  //         },
  //       }
  //     );
  //     if (!data) throw new Error('Can not retrive customers data');

  //     cachedCustomerConfigurations.push(...data);

  //     await this._setCustomerConfigurationsCache(
  //       data.map((entry) => ({
  //         id: entry.id,
  //         user: entry,
  //       }))
  //     );
  //   }

  //   return cachedCustomerConfigurations;
  // }

  // async computeNotificationVisibility({
  //   service,
  //   userId,
  //   uniqueTriggerKey,
  //   notificationPercentage,
  // }: {
  //   service: string;
  //   userId: number;
  //   uniqueTriggerKey: string;
  //   notificationPercentage: NotificationPercentage;
  // }) {
  //   const cacheKey = `${service}/notification_triggers:${userId}`;
  //   const lastNotificationTriggerValues =
  //     await this.redisService.client.smembers(cacheKey);

  //   let triggerIndex = lastNotificationTriggerValues.findIndex(
  //     (entry) => entry === uniqueTriggerKey
  //   );

  //   // set new index if new trigger
  //   if (triggerIndex === -1) {
  //     triggerIndex = lastNotificationTriggerValues.length;
  //     await this.redisService.client.sadd(cacheKey, uniqueTriggerKey);
  //     lastNotificationTriggerValues.push(uniqueTriggerKey);
  //   }

  //   // cut when NVD of possible notificationGap (now it can by 12), and set to the largest gap (now it is 2)
  //   if (lastNotificationTriggerValues.length === 12) {
  //     await this.redisService.client.srem(
  //       cacheKey,
  //       lastNotificationTriggerValues.slice(0, 8)
  //     );
  //   }

  //   const notificationGap = notificationFreeGap(notificationPercentage);
  //   // 50%
  //   // 0 !(0%2) = true
  //   // 1 !(1%2) = false
  //   // 2 !(2%2) = true
  //   // 3 !(3%2) = false

  //   // 25%
  //   // 0 !(0%4) = true
  //   // 1 !(1%4) = false
  //   // 2 !(2%4) = false
  //   // 3 !(3%4) = false
  //   // 4 !(4%4) = true
  //   // 5 !(5%4) = false
  //   return !(triggerIndex % notificationGap);
  // }

  // // static async _getCustomerTriggerIdsToLock(change: CustomerHistoryRecord) {
  // //   const configuration = await this.getCustomerConfiguration(
  // //     change.customer_id,
  // //     false
  // //   );

  // //   const { services } = await utils();

  // //   const alertCount = await services.trigger.getUserAlerts(change.customer_id);
  // //   const proAlertCount = await services.trigger.getUserProAlerts(
  // //     change.customer_id
  // //   );

  // //   const triggerIdsToBlock: string[] = [];
  // //   if (
  // //     alertCount.running.length >
  // //     +configuration.configuration.alerts.running_alerts_limit[0]
  // //   ) {
  // //     triggerIdsToBlock.push(
  // //       ...alertCount.running
  // //         .slice(+configuration.configuration.alerts.running_alerts_limit[0])
  // //         .map((t) => t._id.toString())
  // //     );
  // //   }

  // //   if (
  // //     proAlertCount.running.length >
  // //     +configuration.configuration.pro_alerts.running_pro_alerts_limit[0]
  // //   ) {
  // //     triggerIdsToBlock.push(
  // //       ...proAlertCount.running
  // //         .slice(
  // //           +configuration.configuration.pro_alerts.running_pro_alerts_limit[0]
  // //         )
  // //         .map((t) => t._id.toString())
  // //     );
  // //   }

  // //   return triggerIdsToBlock;
  // // }

  // // static async unlockCustomerRestrictions(change: CustomerHistoryRecord) {
  // //   this.logger.log(`#unlockCustomerRestrictions`, change.customer_id);

  // //   const triggerIdsToBlock = await this._getCustomerTriggerIdsToLock(change);
  // //   this.logger.log(
  // //     `#unlockCustomerRestrictions block ${triggerIdsToBlock.length} triggers`
  // //   );

  // //   if (!triggerIdsToBlock.length)
  // //     return RedisCacheManager.deleteHiddenCustomerTriggers(change.customer_id);
  // //   await RedisCacheManager.setHiddenCustomerTriggers(
  // //     change.customer_id,
  // //     triggerIdsToBlock
  // //   );
  // // }

  // // static async lockCustomerRestrictions(change: CustomerHistoryRecord) {
  // //   this.logger.log(`#lockCustomerRestrictions`, change.customer_id);

  // //   const triggerIdsToBlock = await this._getCustomerTriggerIdsToLock(change);
  // //   this.logger.log(
  // //     `#lockCustomerRestrictions block ${triggerIdsToBlock.length} triggers`
  // //   );

  // //   if (!triggerIdsToBlock.length)
  // //     return RedisCacheManager.deleteHiddenCustomerTriggers(change.customer_id);
  // //   await RedisCacheManager.setHiddenCustomerTriggers(
  // //     change.customer_id,
  // //     triggerIdsToBlock
  // //   );
  // // }

  // // static async performProcessingCustomersChanges() {
  // //   const timeRanges = await redis.hmget('crm/changes/range', 'from', 'to');

  // //   // on the start, check whole day, to prevent missing rows
  // //   if (!timeRanges[0] || !timeRanges[1]) {
  // //     const toDateTime = dayjs()
  // //       .set('millisecond', 0)
  // //       .set('second', 0)
  // //       .set('minutes', 0); // rounde to full hours (cron will be called at full hgours, so there can be 16h:01m 34s:7892ms etc.)
  // //     timeRanges[0] = toDateTime
  // //       .subtract(24, 'hours')
  // //       .format('YYYY-MM-DD HH:mm:ss');
  // //     timeRanges[1] = toDateTime.format('YYYY-MM-DD HH:mm:ss');
  // //   } else {
  // //     // timeRange dates are in past. They are dataes from previous request
  // //     timeRanges[0] = dayjs(timeRanges[0])
  // //       .add(5, 'hours')
  // //       .format('YYYY-MM-DD HH:mm:ss'); // 1h overlap, so period will be 7h
  // //     timeRanges[1] = dayjs(timeRanges[1])
  // //       .add(6, 'hours')
  // //       .format('YYYY-MM-DD HH:mm:ss');
  // //   }

  // //   let { data } = await axios.get<CustomerHistoryRecord[]>(
  // //     `${process.env.CRM_URL}/api/customers/plan/history`,
  // //     {
  // //       params: {
  // //         group_id: 1,
  // //         from: timeRanges[0],
  // //         to: timeRanges[1],
  // //       },
  // //       headers: {
  // //         'api-key': process.env.CRM_API_KEY,
  // //       },
  // //     }
  // //   );

  // //   if (!data.length) return;

  // //   const markedRecords =
  // //     await RedisCacheManager.getMarketCustomersChangeRecords(
  // //       data.map((record) => record.id)
  // //     );
  // //   data = data.filter(
  // //     (record) => !markedRecords.includes(record.id.toString())
  // //   );

  // //   this.logger.log(
  // //     `#performProcessingCustomersChanges start process ${data.length} records`
  // //   );

  // //   const { dbc } = await utils();
  // //   for (const record of data) {
  // //     if (!record.previous) {
  // //       this.logger.log(
  // //         `#performProcessingCustomersChanges no previous record`,
  // //         record.customer_id
  // //       );
  // //       continue;
  // //     }

  // //     // DOWN
  // //     if (record.plan.priority < record.previous.plan.priority) {
  // //       await this.lockCustomerRestrictions(record);
  // //       await waitMs(2_000);

  // //       // check if should turn off listings
  // //       if (
  // //         record.plan.slug !== 'tier-3' &&
  // //         record.previous.plan.slug === 'tier-3'
  // //       ) {
  // //         await dbc.collection<triggers>(Database.triggers).updateMany(
  // //           {
  // //             user_id: record.customer_id,
  // //             based_on: {
  // //               $in: triggerListingsIds.map((id) => new ObjectId(id)),
  // //             },
  // //             is_enabled: true,
  // //           },
  // //           {
  // //             $set: {
  // //               is_enabled: false,
  // //             },
  // //           }
  // //         );
  // //       }
  // //       continue;
  // //     }
  // //     // UP
  // //     else if (record.plan.priority > record.previous.plan.priority) {
  // //       await this.unlockCustomerRestrictions(record);
  // //       await waitMs(2_000);

  // //       // check if should turn on listings
  // //       if (
  // //         record.plan.slug === 'tier-3' &&
  // //         record.previous.plan.slug !== 'tier-3'
  // //       ) {
  // //         await dbc.collection<triggers>(Database.triggers).updateMany(
  // //           {
  // //             user_id: record.customer_id,
  // //             based_on: {
  // //               $in: triggerListingsIds.map((id) => new ObjectId(id)),
  // //             },
  // //             is_enabled: false,
  // //           },
  // //           {
  // //             $set: {
  // //               is_enabled: true,
  // //             },
  // //           }
  // //         );
  // //       }
  // //       continue;
  // //     }

  // //     const newDisconectedAtGreather =
  // //       record.plan.priority === record.previous.plan.priority &&
  // //       dayjs(record.disconnect_at).isAfter(
  // //         dayjs(record.previous.disconnect_at)
  // //       );
  // //     const newDisconectedAtInFuture = dayjs(record.disconnect_at).isAfter(
  // //       dayjs()
  // //     );
  // //     const oldDisconectedAtInPast = dayjs(
  // //       record.previous.disconnect_at
  // //     ).isBefore(dayjs());

  // //     // Upgared access to current plan
  // //     if (
  // //       newDisconectedAtGreather &&
  // //       newDisconectedAtInFuture &&
  // //       oldDisconectedAtInPast
  // //     ) {
  // //       await this.unlockCustomerRestrictions(record);
  // //       await waitMs(2_000);
  // //       continue;
  // //     }

  // //     this.logger.log(
  // //       `#performProcessingCustomersChanges no access change`,
  // //       record
  // //     );
  // //   }

  // //   await RedisCacheManager.markCustomersChangeRecords(
  // //     data.map((record) => record.id)
  // //   );

  // //   // from is dynamic, so in the end fix it to 6h period
  // //   // await redis.hset('crm/changes/range', { from: dayjs(timeRanges[1]).subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss"), to: timeRanges[1] })
  // // }
}
