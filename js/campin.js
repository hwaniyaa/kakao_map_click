

const container = document.querySelector("#map");

// 지도 생성
const mapOption = {
  center: new kakao.maps.LatLng(37.66825, 126.9786557),
  level: 12,
};

const map = new kakao.maps.Map(container, mapOption)

// map아래에 배치 마커 클러스터러를 생성합니다 
const clusterer = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
  minLevel: 10, // 클러스터 할 최소 지도 레벨 
});


// 알림판 1. 커스텀
const customOverlay = new kakao.maps.CustomOverlay({
  map:map,
})

// 클릭 타겟이 버튼일때 null 실행 닫기 버튼
container.addEventListener("click",function(e){
  if(e.target.closest("button")) {
    customOverlay.setMap(null);
    console.log("클릭")
  }
  
});

// fetch api가져오기
fetch(`https://apis.data.go.kr/B551011/GoCamping/basedList?MobileOS=ETC&MobileApp=TIS&serviceKey=puBH5ep5sEYq8NXbZ0cFOuDTnYOzMMnbrk09ZObbJniLw3qzzGUqNCeD17b%2BbFxWvRlQxEcIqyAX28YkejamUQ%3D%3D&_type=json&numOfRows=500`)

// 받아서 json으로 넘김
.then(function(response){
  return response.json();
})
// 받아서 출력
.then(function(result){
  // api 가져옴
  const campingList = result.response.body.items.item;
  // 1. markers 배열만들어서
  const markers = []
  campingList.forEach(function(item, idx){
    const marker = new kakao.maps.Marker({
      map:map,
      position: new kakao.maps.LatLng(item.mapY, item.mapX),
    });

    // 알림판 2. marker에 클릭 이벤트
    kakao.maps.event.addListener(marker, "click", function(){
      // 맵을 가져옴
      customOverlay.setMap(map);
      // 위치를 가져옴
      customOverlay.setPosition(marker.getPosition())
      // 만들고 싶은거 작성
      customOverlay.setContent(
        `
        <div class="contents-box">
          <div class="title">${item.facltNm}</div>
          <div class="address">${item.addr1} / ${item.addr2}</div>
          <div class="tel">${item.tel}</div>
          <div class="direction">${item.direction}</div>
          <div class="reservation"><a href="${item.homepage}" target="_blank"></a></div>
          <button class="close"><span class="material-icons">close</span></button>
        </div>
        `
        );
    });
    // 2. markers 배열만들어서 for으로 돌아가는 marker를 넣는다
    markers.push(marker);
  });
  // 3. markers 을 실행
  clusterer.addMarkers(markers);
});


