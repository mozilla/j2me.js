package tests.background;

import java.io.IOException;
import javax.microedition.midlet.MIDlet;
import javax.microedition.io.Connector;
import com.nokia.mid.s40.io.LocalMessageProtocolServerConnection;

public class ForegroundMIDlet extends MIDlet {
    public ForegroundMIDlet() {
    }

    public void startApp() {
        try {
            LocalMessageProtocolServerConnection server = (LocalMessageProtocolServerConnection)Connector.open("localmsg://:mozilla");
        } catch (IOException e) {
            System.out.println("Unexpected exception: " + e);
            e.printStackTrace();
        }

        System.out.println("Hello World from foreground MIDlet");
    }

    public void pauseApp() {
    }

    public void destroyApp(boolean unconditional) {
    }
}
