//
//  AppUserDefaults.swift
//  Fitia
//
//  Created by Kohji Onaja on 5/05/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import Foundation

enum AppUserStore {
    
    case defaultStore(key: AppUserStandarStoreKey)
    case sharedStore(key: AppUserSharedStoreKey)
    
    var key: String {
        switch self {
        case .defaultStore(let key):
            return key.keyValue
        case .sharedStore(let key):
            return key.keyValue
        }
    }
    
    var store: UserDefaults? {
        switch self {
        case .defaultStore(_):
                .standard
        case .sharedStore(_):
                .init(suiteName: "group.com.ulisesolave.Fitia")
        }
    }
}


@propertyWrapper
struct AppUserDefaults<T: Codable> {
    
    private let key: String
    private let store: UserDefaults?
    
    init(store: AppUserStore) {
        self.key = store.key
        self.store = store.store
    }
    
    var wrappedValue: T? {
        get {
            guard let data = store?.data(forKey: key) else { return nil }
            return try? JSONDecoder().decode(T.self, from: data)
        }
        set {
            guard let value = newValue else {
                store?.removeObject(forKey: key)
                return
            }
            if let data = try? JSONEncoder().encode(value) {
                store?.set(data, forKey: key)
            }
        }
    }
}


