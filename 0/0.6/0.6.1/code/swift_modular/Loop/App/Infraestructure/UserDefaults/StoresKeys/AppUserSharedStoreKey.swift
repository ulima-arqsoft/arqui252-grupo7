//
//  AppUserStoreSharedKey.swift
//  FitiaWatch
//
//  Created by Kohji Onaja on 5/05/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import Foundation

enum AppUserSharedStoreKey: AppUserStoreKeys {
    case mealProgress
    case streaksProgress
    
    var keyValue: String {
        switch self {
        case .mealProgress: "mealProgress"
        case .streaksProgress: "streaksProgress"
        }
    }
    
}
