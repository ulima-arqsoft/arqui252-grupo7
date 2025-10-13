//
//  NavigationDestination.swift
//  NavigationRouting
//
//  Created by Kohji Onaja on 8/06/25.
//

import SwiftUI

struct NavigationDestination: Identifiable, Hashable {
    let id: String
    let option: NavigationOption
    let onDismiss: (() -> Void)?
    let build: (Router) -> AnyView

    init<T: View>(
        id: String = UUID().uuidString,
        option: NavigationOption = .push,
        onDismiss: (() -> Void)? = nil,
        destination: @escaping (Router) -> T
    ) {
        self.id = id
        self.option = option
        self.build = { router in
            AnyView(destination(router))
        }
        self.onDismiss = onDismiss
    }

    nonisolated func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    nonisolated static func == (lhs: NavigationDestination, rhs: NavigationDestination) -> Bool {
        lhs.id == rhs.id
    }
}
