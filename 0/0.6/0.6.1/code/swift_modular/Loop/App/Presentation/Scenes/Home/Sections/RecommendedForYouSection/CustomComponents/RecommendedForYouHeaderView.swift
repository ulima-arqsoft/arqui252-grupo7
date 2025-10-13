//
//  RecommendedForYouHeaderView.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI
import LoopCore

struct RecommendedForYouHeaderView: View {
    let categories: [LoopCategory]
    @Binding var selectedCategory: LoopCategory
    
    var body: some View {
        ScrollViewReader { proxy in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack {
                    ForEach(categories, id: \.id) { category in
                        let isSelected = category == selectedCategory
                        LoopButton(
                            text: category.name,
                            onTapButton: {
                                selectedCategory = category
                                withAnimation(.interpolatingSpring) {
                                    proxy.scrollTo(category.id, anchor: .center)
                                }
                            }
                        )
                        .backgroundColor(
                            light: isSelected ? .black : .clear,
                            dark: isSelected ? .white : .clear
                        )
                        .borderColor(
                            light: .black,
                            dark: .white
                        )
                        .foregroundColor(
                            light: isSelected ? .white : .black,
                            dark: isSelected ? .black : .white
                        )
                        .id(category.id)
                    }
                }
                .padding(.horizontal)
            }
        }
    }
}

#Preview {
    RecommendedForYouHeaderView(categories: [], selectedCategory: .constant(.finance))
}
