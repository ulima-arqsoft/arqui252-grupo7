//
//  TabView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI
import LoopCartModule

struct MainTabView: View {
    
    @StateObject var coordinator = TabCoordinator.shared
    
    @Environment(\.colorScheme) var colorScheme
    
    @Environment(\.router) var router: Router?

    init() {
        UITabBar.appearance().unselectedItemTintColor = UIColor.systemGray
    }
    
    var body: some View {
        TabView(selection: $coordinator.selectedTab) {
            Group {
                HomeViewBuilder.build()
                    .tag(TabViewType.home)
                    .tabItem {
                        Image("ic_home")
                            .renderingMode(.template)
                            .resizable()
                            .scaledToFit()
                    }
                
                ExploreViewBuilder.build()
                    .tag(TabViewType.explore)
                    .tabItem {
                        Image("ic_grid")
                            .renderingMode(.template)
                            .resizable()
                            .scaledToFit()
                    }
                
                CartViewBuilder.build()
                    .tag(TabViewType.cart)
                    .tabItem {
                        Image("ic_shopping_bag")
                            .renderingMode(.template)
                            .resizable()
                            .scaledToFit()
                    }
                
                ProfileViewBuilder.build()
                    .tag(TabViewType.profile)
                    .tabItem {
                        Image("ic_profile")
                            .renderingMode(.template)
                            .resizable()
                            .scaledToFit()
                    }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
    
}

#Preview {
    MainTabViewBuilder.build()
}
