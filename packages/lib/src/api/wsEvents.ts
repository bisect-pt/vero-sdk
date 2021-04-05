export enum SettingsEvents {
    /*
    Collection update
    Payload= {
        collection : string - one of the identifiers in collections below
        added : undefined | [an array of added objects]
        deletedIDs : undefined | [an array of IDs of deleted objects]
        updated : undefined | [an array of updated objects]
    }
    */
    collectionUpdate = 'COLLECTION_UPDATE',
    notify = 'NOTIFY',
    systemStatus = 'SYSTEM_STATUS',
    interruptSystem = 'INTERRUPT_SYSTEM',
    systemUpdate = 'SYSTEM_UPDATE',
    downloadManagerUpdate = 'DOWNLOAD_MANAGER_UPDATE',
    generatorStatus = 'GENERATOR_STATUS',
    capturestatus = 'CAPTURE_STATUS',
    captureJobStatus = 'CAPTUREJOB_STATUS',
}
