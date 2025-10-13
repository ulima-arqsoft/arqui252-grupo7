//
//  AppUserStandarStoreKey.swift
//  FitiaWatch
//
//  Created by Kohji Onaja on 5/05/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import Foundation

enum AppUserStandarStoreKey: AppUserStoreKeys {
    
    case user
    case dailyRecord
    case setMealProgressAsRemaining
    case shouldUpdateProgressView
    case recentsSearches
    case cloudFunctionFetchTimestamps
    case mealItemsToCopy
    
    var keyValue: String {
        switch self {
        case .user: "user"
        case .dailyRecord: "dailyRecord"
        case .setMealProgressAsRemaining: "setMealProgressAsRemaining"
        case .shouldUpdateProgressView: "shouldUpdateProgressView"
        case .recentsSearches: "recentsSearches"
        case .cloudFunctionFetchTimestamps: "cloudFunctionFetchTimestamps"
        case .mealItemsToCopy: "mealItemsToCopy"
        }
    }
    
}



