if [ $1 == 'macOS' ]
then
  echo 'Sorry we cannot build the StreamDeck app on macOS: https://developer.elgato.com/documentation/stream-deck/sdk/exporting-your-plugin/'
elif [ $2 == 'Windows' ]
then
  echo 'Sorry we cannot build the StreamDeck app on Windows: https://developer.elgato.com/documentation/stream-deck/sdk/exporting-your-plugin/'
else
  echo 'Sorry we cannot build the StreamDeck app on Linux: https://developer.elgato.com/documentation/stream-deck/sdk/exporting-your-plugin/'
fi