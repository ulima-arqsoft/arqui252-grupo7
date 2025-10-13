//
//  DependencyContainer.swift
//  Fitia
//
//  Created by Kohji Onaja on 2/06/25.
//  Copyright © 2025 Ulises Olave mendoza. All rights reserved.
//

import SwiftUI

@propertyWrapper
struct DependencyContainer<Value>: DynamicProperty {
    
    @EnvironmentObject var dependencyContainer: AppContainer

    var wrappedValue: Value {
        get {
            dependencyContainer[keyPath: key]
        }
        nonmutating set {
            dependencyContainer[keyPath: key] = newValue
        }
    }

    private let key: ReferenceWritableKeyPath<AppContainer, Value>

    init(_ key: ReferenceWritableKeyPath<AppContainer, Value>) {
        self.key = key
    }
}
