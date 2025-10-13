//
//  LoopApp.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI
import GoogleSignIn

@main
struct LoopApp: App {
    
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    var body: some Scene {
        WindowGroup {
            NavigatableView { _ in
                MainViewBuilder.build()
            }
//            .onAppear(perform: AuthMonitor.shared.checkUserAuthState)
            .environmentObject(AppContainer())
            .onOpenURL { url in
                GIDSignIn.sharedInstance.handle(url)
            }
        }
    }
}
