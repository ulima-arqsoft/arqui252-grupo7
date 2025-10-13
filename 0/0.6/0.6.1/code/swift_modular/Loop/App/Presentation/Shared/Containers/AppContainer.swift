//
//  AppContainer.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

class AppContainer: ObservableObject {
    
    init() {}
    
    lazy var authContainer: () -> AuthContainer = {
        AuthContainer()
    }
    
//    lazy var databaseContainerBuilder: () -> DatabaseContainer = {
//        DatabaseContainer(httpClient: self.httpClient)
//    }
//    
//    lazy var userContainer: UserContainer = {
//        UserContainer(httpClient: httpClient)
//    }()
//    
//    lazy var cloudFunctionSyncTracker: CloudFunctionSyncTracker = {
//        CloudFunctionSyncTrackerImplementation()
//    }()
//    
//    lazy var planContainer: PlanContainer = {
//        PlanContainer(
//            httpClient: httpClient,
//            cloudFunctionSyncTracker: cloudFunctionSyncTracker
//        )
//    }()
//    
//    lazy var eventLoggerContainer: EventLoggerContainer = {
//        EventLoggerContainer(httpClient: httpClient)
//    }()
//    
//    lazy private var httpClient: HTTPClient = {
//        URLSessionHTTPClient()
//    }()
    
}
