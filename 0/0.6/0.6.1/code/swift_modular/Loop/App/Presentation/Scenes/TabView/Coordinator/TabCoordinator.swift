//
//  TabCoordinator.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

@MainActor
class TabCoordinator: ObservableObject {
    
    static let shared = TabCoordinator()
    private init() {}
    
    @Published var selectedTab: TabViewType = .cart
    
    func setTab(to newTab: TabViewType) {
        self.selectedTab = newTab
    }
}
